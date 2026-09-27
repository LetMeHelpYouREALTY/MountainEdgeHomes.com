/**
 * Reusable hyperlocal amenity map for Mountain's Edge (static HTML site).
 * Lazy-loads Google Maps; Places (New) searchNearby with per-category session cache.
 */
(function () {
  'use strict';

  var mapsReady = null;
  var mapsAuthFailed = false;

  if (typeof window !== 'undefined') {
    window.addEventListener('gmaps:auth-failure', function () {
      mapsAuthFailed = true;
    });
  }

  var categorySearchCache = new Map();

  function getConfig() {
    return window.MountainEdgeCommunityMapConfig || null;
  }

  function getApiKey() {
    var env = window.MountainEdgeMapsPublicEnv || {};
    if (env.apiKey) return env.apiKey;
    var meta = document.querySelector('meta[name="google-maps-api-key"]');
    return meta && meta.getAttribute('content') ? meta.getAttribute('content') : '';
  }

  function getMapId() {
    var env = window.MountainEdgeMapsPublicEnv || {};
    return env.mapId || '';
  }

  function directionsUrl(lat, lng, name) {
    var q = encodeURIComponent((name || '') + ' ' + lat + ',' + lng);
    return 'https://www.google.com/maps/dir/?api=1&destination=' + q;
  }

  function embedFallbackUrl(center) {
    return (
      'https://www.google.com/maps?q=' +
      center.lat +
      ',' +
      center.lng +
      '&z=14&output=embed'
    );
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function placeDisplayName(place) {
    var name = place.displayName || place.name || 'Place';
    if (name && typeof name === 'object' && name.text) {
      return name.text;
    }
    return String(name);
  }

  function loadGoogleMaps(apiKey) {
    if (typeof window === 'undefined') {
      return Promise.reject(new Error('ssr'));
    }
    if (window.google && window.google.maps && window.google.maps.importLibrary) {
      return Promise.resolve();
    }
    if (mapsReady) return mapsReady;
    mapsReady = new Promise(function (resolve, reject) {
      var cb = '__gmapsReadyMountainEdge';
      window[cb] = function () {
        resolve();
      };
      window.gm_authFailure = function () {
        window.dispatchEvent(new Event('gmaps:auth-failure'));
        mapsReady = null;
        reject(new Error('gm_authFailure'));
      };
      var script = document.createElement('script');
      script.src =
        'https://maps.googleapis.com/maps/api/js?key=' +
        encodeURIComponent(apiKey) +
        '&v=weekly&loading=async&callback=' +
        cb;
      script.async = true;
      script.onerror = function () {
        mapsReady = null;
        reject(new Error('maps script failed'));
      };
      document.head.appendChild(script);
    });
    return mapsReady;
  }

  function searchCategoryPlaces(center, categoryId, types, radiusMeters) {
    var cached = categorySearchCache.get(categoryId);
    if (cached) return cached;

    var promise = (async function () {
      var lib = await google.maps.importLibrary('places');
      var Place = lib.Place;
      var response = await Place.searchNearby({
        fields: ['displayName', 'location', 'formattedAddress', 'googleMapsURI'],
        locationRestriction: {
          center: center,
          radius: radiusMeters,
        },
        includedPrimaryTypes: types,
        maxResultCount: 10,
        rankPreference: 'POPULARITY',
      });
      return response.places || [];
    })();

    promise.catch(function () {
      categorySearchCache.delete(categoryId);
    });
    categorySearchCache.set(categoryId, promise);
    return promise;
  }

  function buildStaticListHtml(places, categoryKey) {
    var filtered = places.filter(function (p) {
      return !categoryKey || p.category === categoryKey;
    });
    if (!filtered.length) {
      filtered = places.slice(0, 8);
    }
    var items = filtered
      .map(function (p) {
        var line = '<strong>' + escapeHtml(p.name) + '</strong>';
        if (p.address) {
          line += ' — ' + escapeHtml(p.address);
        }
        return '<li>' + line + '</li>';
      })
      .join('');
    return (
      '<h3 id="amenity-static-list-heading">Featured nearby places</h3><ul aria-labelledby="amenity-static-list-heading">' +
      items +
      '</ul>'
    );
  }

  function renderFallback(root, center, places, categoryKey) {
    var wrap = root.querySelector('.amenity-map-canvas-wrap');
    if (!wrap) return;
    wrap.innerHTML =
      '<iframe class="amenity-map-embed-fallback" title="Map of Mountain\'s Edge, Las Vegas" loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="' +
      embedFallbackUrl(center) +
      '"></iframe>';
    var listEl = root.querySelector('.amenity-map-static-list');
    if (listEl) {
      listEl.innerHTML = buildStaticListHtml(places, categoryKey);
      listEl.hidden = false;
    }
    var status = root.querySelector('.amenity-map-status');
    if (status) {
      status.textContent =
        'Showing a map embed and curated local places.';
    }
  }

  function AmenityMapInstance(root) {
    this.root = root;
    this.config = getConfig();
    this.center = this.config.center;
    this.places = this.config.curatedPlaces || [];
    this.markers = [];
    this.map = null;
    this.infoWindow = null;
    this.fallbackMode = false;
    this.activeCategory =
      this.config.categoryOrder && this.config.categoryOrder[0]
        ? this.config.categoryOrder[0]
        : 'restaurants';
    this.compact = root.classList.contains('amenity-map-widget--compact');
    this.height =
      root.getAttribute('data-amenity-map-height') ||
      (this.compact ? '420' : '480');
    root.style.setProperty('--amenity-map-height', this.height + 'px');
    this._onAuthFailure = null;
  }

  AmenityMapInstance.prototype.buildChrome = function () {
    var cfg = this.config;
    var filtersHtml = cfg.categoryOrder
      .map(function (key) {
        var cat = cfg.categories[key];
        if (!cat) return '';
        return (
          '<button type="button" class="amenity-map-filter" data-category="' +
          key +
          '" aria-pressed="false" aria-label="Show ' +
          escapeHtml(cat.label) +
          ' near Mountain\'s Edge">' +
          escapeHtml(cat.label) +
          '</button>'
        );
      })
      .join('');

    this.root.innerHTML =
      '<div class="amenity-map-layout">' +
      '<div class="amenity-map-main">' +
      '<div class="amenity-map-filters" role="toolbar" aria-label="Filter nearby amenities">' +
      filtersHtml +
      '</div>' +
      '<div class="amenity-map-canvas-wrap" aria-label="Interactive map of nearby amenities">' +
      '<div class="amenity-map-canvas" role="application" tabindex="0"></div>' +
      '</div>' +
      '<p class="amenity-map-status" aria-live="polite"></p>' +
      '</div>' +
      '<div class="amenity-map-static-list" aria-label="Curated nearby places"></div>' +
      '</div>';

    var self = this;
    this.root.querySelectorAll('.amenity-map-filter').forEach(function (btn) {
      btn.addEventListener('click', function () {
        self.setCategory(btn.getAttribute('data-category'));
      });
    });
  };

  AmenityMapInstance.prototype.enterFallback = function () {
    if (this.fallbackMode) return;
    this.fallbackMode = true;
    this.clearMarkers();
    this.map = null;
    renderFallback(this.root, this.center, this.places, this.activeCategory);
  };

  AmenityMapInstance.prototype.setCategory = function (key) {
    this.activeCategory = key;
    this.root.querySelectorAll('.amenity-map-filter').forEach(function (btn) {
      var active = btn.getAttribute('data-category') === key;
      btn.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
    if (this.fallbackMode || mapsAuthFailed) {
      renderFallback(this.root, this.center, this.places, key);
      return;
    }
    if (this.map) {
      this.searchCategory(key);
    } else {
      var listEl = this.root.querySelector('.amenity-map-static-list');
      if (listEl) {
        listEl.innerHTML = buildStaticListHtml(this.places, key);
      }
    }
  };

  AmenityMapInstance.prototype.clearMarkers = function () {
    this.markers.forEach(function (m) {
      if (m.setMap) m.setMap(null);
      if (m.map !== undefined) m.map = null;
    });
    this.markers = [];
  };

  AmenityMapInstance.prototype.openInfo = function (name, address, position) {
    var container = document.createElement('div');
    container.className = 'amenity-map-info-window';
    var heading = document.createElement('h4');
    heading.textContent = name;
    container.appendChild(heading);
    if (address) {
      var addr = document.createElement('p');
      addr.textContent = address;
      container.appendChild(addr);
    }
    var linkWrap = document.createElement('p');
    var link = document.createElement('a');
    link.href = directionsUrl(position.lat, position.lng, name);
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.textContent = 'Directions';
    linkWrap.appendChild(link);
    container.appendChild(linkWrap);
    this.infoWindow.setContent(container);
    this.infoWindow.setPosition(position);
    this.infoWindow.open(this.map);
  };

  AmenityMapInstance.prototype.addCommunityMarker = function () {
    var cfg = this.config;
    var title = cfg.communityName + ', ' + cfg.city;
    var position = this.center;
    var mapId = getMapId();
    var self = this;

    if (mapId && google.maps.marker && google.maps.marker.AdvancedMarkerElement) {
      var pin = document.createElement('div');
      pin.className = 'amenity-map-community-pin';
      pin.textContent = cfg.communityName;
      pin.style.cssText =
        'background:#44734e;color:#fff;padding:4px 8px;border-radius:4px;font-size:12px;font-weight:700;';
      var adv = new google.maps.marker.AdvancedMarkerElement({
        map: this.map,
        position: position,
        title: title,
        content: pin,
      });
      adv.addListener('click', function () {
        self.openInfo(title, cfg.city + ' ' + cfg.postalCode, position);
      });
      this.markers.push(adv);
      return;
    }

    var marker = new google.maps.Marker({
      map: this.map,
      position: position,
      title: title,
      zIndex: 1000,
    });
    marker.addListener('click', function () {
      self.openInfo(
        title,
        'Master-planned community in southwest ' + cfg.city + ', ' + cfg.state,
        position
      );
    });
    this.markers.push(marker);
  };

  AmenityMapInstance.prototype.addPlaceMarker = function (place) {
    var self = this;
    var name = placeDisplayName(place);
    var loc = place.location;
    if (!loc) return;
    var lat = typeof loc.lat === 'function' ? loc.lat() : loc.lat;
    var lng = typeof loc.lng === 'function' ? loc.lng() : loc.lng;
    var position = { lat: lat, lng: lng };
    var address = place.formattedAddress || '';

    var marker = new google.maps.Marker({
      map: this.map,
      position: position,
      title: name,
    });
    marker.addListener('click', function () {
      self.openInfo(name, address, position);
    });
    this.markers.push(marker);
  };

  AmenityMapInstance.prototype.addCuratedMarkers = function (categoryKey) {
    var self = this;
    this.places
      .filter(function (p) {
        return p.category === categoryKey;
      })
      .forEach(function (p) {
        var marker = new google.maps.Marker({
          map: self.map,
          position: { lat: p.lat, lng: p.lng },
          title: p.name,
        });
        marker.addListener('click', function () {
          self.openInfo(p.name, p.address || '', { lat: p.lat, lng: p.lng });
        });
        self.markers.push(marker);
      });
  };

  AmenityMapInstance.prototype.searchCategory = function (key) {
    var self = this;
    var cat = this.config.categories[key];
    if (!cat || !this.map) return;

    this.clearMarkers();
    this.addCommunityMarker();

    var status = this.root.querySelector('.amenity-map-status');
    if (status) status.textContent = 'Loading ' + cat.label.toLowerCase() + '…';

    var listEl = this.root.querySelector('.amenity-map-static-list');
    if (listEl && !this.compact) {
      listEl.innerHTML = buildStaticListHtml(this.places, key);
      listEl.hidden = false;
    }

    var radius = this.config.searchRadiusMeters || 5000;

    searchCategoryPlaces(this.center, key, cat.primaryTypes, radius)
      .then(function (places) {
        if (self.fallbackMode || mapsAuthFailed) return;
        places.forEach(function (pl) {
          self.addPlaceMarker(pl);
        });
        if (status) {
          status.textContent =
            places.length > 0
              ? 'Showing ' +
                places.length +
                ' ' +
                cat.label.toLowerCase() +
                ' near ' +
                self.config.communityName +
                '.'
              : 'No live results for this filter; showing curated local places.';
        }
        if (places.length === 0) {
          self.addCuratedMarkers(key);
        }
      })
      .catch(function () {
        if (self.fallbackMode || mapsAuthFailed) return;
        self.addCuratedMarkers(key);
        if (listEl) {
          listEl.innerHTML = buildStaticListHtml(self.places, key);
          listEl.hidden = false;
        }
        if (status) {
          status.textContent =
            'Live place search unavailable; showing curated local places for ' +
            cat.label.toLowerCase() +
            '.';
        }
      });
  };

  AmenityMapInstance.prototype.initInteractive = function () {
    var canvas = this.root.querySelector('.amenity-map-canvas');
    if (!canvas) return;

    var mapOptions = {
      center: this.center,
      zoom: this.config.defaultZoom || 13,
      mapTypeControl: true,
      streetViewControl: true,
      fullscreenControl: true,
      zoomControl: true,
      styles: [
        {
          featureType: 'poi',
          elementType: 'labels',
          stylers: [{ visibility: 'simplified' }],
        },
      ],
    };
    var mapId = getMapId();
    if (mapId) {
      mapOptions.mapId = mapId;
    }

    this.map = new google.maps.Map(canvas, mapOptions);
    this.infoWindow = new google.maps.InfoWindow();
    this.setCategory(this.activeCategory);
  };

  AmenityMapInstance.prototype.start = function () {
    this.buildChrome();
    var self = this;

    this._onAuthFailure = function () {
      self.enterFallback();
    };
    window.addEventListener('gmaps:auth-failure', this._onAuthFailure);

    if (mapsAuthFailed) {
      this.enterFallback();
      this.setCategory(this.activeCategory);
      return;
    }

    var apiKey = getApiKey();
    if (!apiKey) {
      this.enterFallback();
      this.setCategory(this.activeCategory);
      return;
    }

    loadGoogleMaps(apiKey)
      .then(function () {
        if (mapsAuthFailed) {
          self.enterFallback();
          self.setCategory(self.activeCategory);
          return;
        }
        try {
          self.initInteractive();
        } catch (err) {
          self.enterFallback();
          self.setCategory(self.activeCategory);
        }
      })
      .catch(function () {
        self.enterFallback();
        self.setCategory(self.activeCategory);
      });
  };

  AmenityMapInstance.prototype.destroy = function () {
    if (this._onAuthFailure) {
      window.removeEventListener('gmaps:auth-failure', this._onAuthFailure);
    }
  };

  function observeAndInit() {
    var nodes = document.querySelectorAll('[data-amenity-map]');
    if (!nodes.length) return;

    nodes.forEach(function (node) {
      if (node.getAttribute('data-amenity-map-init') === '1') return;

      var run = function () {
        if (node.getAttribute('data-amenity-map-init') === '1') return;
        node.setAttribute('data-amenity-map-init', '1');
        if (node.getAttribute('data-amenity-map-compact') === 'true') {
          node.classList.add('amenity-map-widget--compact');
        } else {
          node.classList.add('amenity-map-widget--full');
        }
        node.classList.add('amenity-map-widget');
        new AmenityMapInstance(node).start();
      };

      if ('IntersectionObserver' in window) {
        var observer = new IntersectionObserver(
          function (entries) {
            entries.forEach(function (entry) {
              if (entry.isIntersecting) {
                observer.disconnect();
                run();
              }
            });
          },
          { rootMargin: '120px' }
        );
        observer.observe(node);
      } else {
        run();
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', observeAndInit);
  } else {
    observeAndInit();
  }
})();
