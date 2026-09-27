/**
 * Reusable hyperlocal amenity map for Mountain's Edge (static HTML site).
 * Lazy-loads Google Maps; uses Places (New) searchNearby when available, else legacy nearbySearch.
 */
(function () {
  'use strict';

  var loadedScript = false;
  var loadingScript = false;

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

  function buildStaticListHtml(places, categoryKey) {
    var filtered = places.filter(function (p) {
      return !categoryKey || p.category === categoryKey;
    });
    if (!filtered.length) {
      filtered = places.slice(0, 8);
    }
    var items = filtered
      .map(function (p) {
        return (
          '<li><strong>' +
          escapeHtml(p.name) +
          '</strong> — ' +
          escapeHtml(p.address) +
          '</li>'
        );
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
        'Interactive amenities load when a Google Maps API key is configured. Showing map embed and curated local places.';
    }
  }

  function loadGoogleMaps(apiKey, callback) {
    if (window.google && window.google.maps) {
      callback();
      return;
    }
    if (loadedScript) {
      var wait = setInterval(function () {
        if (window.google && window.google.maps) {
          clearInterval(wait);
          callback();
        }
      }, 100);
      return;
    }
    if (loadingScript) {
      document.addEventListener('mountainedge-maps-ready', callback, { once: true });
      return;
    }
    loadingScript = true;
    var script = document.createElement('script');
    script.src =
      'https://maps.googleapis.com/maps/api/js?key=' +
      encodeURIComponent(apiKey) +
      '&loading=async&libraries=places&callback=mountainEdgeAmenityMapsBoot';
    script.async = true;
    script.defer = true;
    script.onerror = function () {
      loadingScript = false;
      document.dispatchEvent(new CustomEvent('mountainedge-maps-failed'));
    };
    window.mountainEdgeAmenityMapsBoot = function () {
      loadedScript = true;
      loadingScript = false;
      document.dispatchEvent(new CustomEvent('mountainedge-maps-ready'));
      callback();
    };
    document.head.appendChild(script);
  }

  function AmenityMapInstance(root) {
    this.root = root;
    this.config = getConfig();
    this.center = this.config.center;
    this.places = this.config.curatedPlaces || [];
    this.markers = [];
    this.map = null;
    this.infoWindow = null;
    this.activeCategory =
      this.config.categoryOrder && this.config.categoryOrder[0]
        ? this.config.categoryOrder[0]
        : 'restaurants';
    this.compact = root.classList.contains('amenity-map-widget--compact');
    this.height =
      root.getAttribute('data-amenity-map-height') ||
      (this.compact ? '420' : '480');
    root.style.setProperty('--amenity-map-height', this.height + 'px');
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

  AmenityMapInstance.prototype.setCategory = function (key) {
    this.activeCategory = key;
    this.root.querySelectorAll('.amenity-map-filter').forEach(function (btn) {
      var active = btn.getAttribute('data-category') === key;
      btn.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
    if (this.map) {
      this.searchCategory(key);
    } else {
      renderFallback(this.root, this.center, this.places, key);
    }
  };

  AmenityMapInstance.prototype.clearMarkers = function () {
    this.markers.forEach(function (m) {
      if (m.setMap) m.setMap(null);
      if (m.map) m.map = null;
    });
    this.markers = [];
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
        self.openInfo(title, cfg.city + ' ' + cfg.postalCode, null, position);
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
        null,
        position
      );
    });
    this.markers.push(marker);
  };

  AmenityMapInstance.prototype.openInfo = function (name, address, rating, position) {
    var html =
      '<div class="amenity-map-info-window"><h4>' +
      escapeHtml(name) +
      '</h4>';
    if (rating) {
      html += '<p>Rating: ' + escapeHtml(String(rating)) + '</p>';
    }
    if (address) {
      html += '<p>' + escapeHtml(address) + '</p>';
    }
    html +=
      '<p><a href="' +
      directionsUrl(position.lat, position.lng, name) +
      '" target="_blank" rel="noopener noreferrer">Directions</a></p></div>';
    this.infoWindow.setContent(html);
    this.infoWindow.setPosition(position);
    this.infoWindow.open(this.map);
  };

  AmenityMapInstance.prototype.addPlaceMarker = function (place) {
    var self = this;
    var name = place.displayName || place.name || 'Place';
    if (name && typeof name === 'object' && name.text) {
      name = name.text;
    }
    var loc = place.location || place.geometry?.location;
    var lat = typeof loc.lat === 'function' ? loc.lat() : loc.lat;
    var lng = typeof loc.lng === 'function' ? loc.lng() : loc.lng;
    var position = { lat: lat, lng: lng };
    var address =
      place.formattedAddress ||
      place.vicinity ||
      (place.formatted_address || '');
    var rating = place.rating;

    var marker = new google.maps.Marker({
      map: this.map,
      position: position,
      title: name,
    });
    marker.addListener('click', function () {
      self.openInfo(name, address, rating, position);
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
          self.openInfo(p.name, p.address, null, { lat: p.lat, lng: p.lng });
        });
        self.markers.push(marker);
      });
  };

  AmenityMapInstance.prototype.searchCategory = function (key) {
    var self = this;
    var cat = this.config.categories[key];
    if (!cat) return;

    this.clearMarkers();
    this.addCommunityMarker();

    var status = this.root.querySelector('.amenity-map-status');
    if (status) status.textContent = 'Loading ' + cat.label.toLowerCase() + '…';

    var listEl = this.root.querySelector('.amenity-map-static-list');
    if (listEl && !this.compact) {
      listEl.innerHTML = buildStaticListHtml(this.places, key);
    }

    function onResults(count) {
      if (status) {
        status.textContent =
          count > 0
            ? 'Showing ' + count + ' ' + cat.label.toLowerCase() + ' near ' + self.config.communityName + '.'
            : 'No results for this filter; showing curated local places instead.';
      }
      if (count === 0) {
        self.addCuratedMarkers(key);
      }
    }

    function runNewPlacesSearch(PlaceCtor) {
      var center = new google.maps.LatLng(self.center.lat, self.center.lng);
      var request = {
        fields: ['displayName', 'location', 'formattedAddress', 'rating'],
        locationRestriction: {
          center: center,
          radius: self.config.searchRadiusMeters || 8000,
        },
        includedPrimaryTypes: cat.primaryTypes,
        maxResultCount: 15,
      };
      PlaceCtor.searchNearby(request)
        .then(function (response) {
          var places = response.places || [];
          places.forEach(function (pl) {
            self.addPlaceMarker({
              displayName: pl.displayName,
              location: pl.location,
              formattedAddress: pl.formattedAddress,
              rating: pl.rating,
            });
          });
          onResults(places.length);
        })
        .catch(function () {
          self.legacyNearbySearch(cat, onResults);
        });
    }

    if (google.maps.importLibrary) {
      google.maps
        .importLibrary('places')
        .then(function (lib) {
          if (lib.Place && lib.Place.searchNearby) {
            runNewPlacesSearch(lib.Place);
          } else {
            self.legacyNearbySearch(cat, onResults);
          }
        })
        .catch(function () {
          self.legacyNearbySearch(cat, onResults);
        });
      return;
    }

    if (google.maps.places && google.maps.places.Place && google.maps.places.Place.searchNearby) {
      runNewPlacesSearch(google.maps.places.Place);
      return;
    }

    this.legacyNearbySearch(cat, onResults);
  };

  AmenityMapInstance.prototype.legacyNearbySearch = function (cat, onResults) {
    var self = this;
    var service = new google.maps.places.PlacesService(this.map);
    service.nearbySearch(
      {
        location: this.center,
        radius: this.config.searchRadiusMeters || 8000,
        type: cat.legacyType,
      },
      function (results, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK && results) {
          results.slice(0, 15).forEach(function (r) {
            self.addPlaceMarker({
              name: r.name,
              geometry: r.geometry,
              vicinity: r.vicinity,
              rating: r.rating,
            });
          });
          onResults(results.length);
        } else {
          self.addCuratedMarkers(self.activeCategory);
          onResults(0);
        }
      }
    );
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
    var apiKey = getApiKey();
    if (!apiKey) {
      renderFallback(this.root, this.center, this.places, this.activeCategory);
      this.setCategory(this.activeCategory);
      return;
    }
    var self = this;
    loadGoogleMaps(apiKey, function () {
      try {
        self.initInteractive();
      } catch (err) {
        renderFallback(self.root, self.center, self.places, self.activeCategory);
      }
    });
    document.addEventListener(
      'mountainedge-maps-failed',
      function () {
        renderFallback(self.root, self.center, self.places, self.activeCategory);
      },
      { once: true }
    );
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
