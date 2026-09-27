/**
 * Posts lead forms to same-origin /api/lead (FUB key stays server-side).
 * Opt in: data-fub="true", data-lead="true", or class contact-form.
 */
(function () {
  function getPhoneDisplay() {
    if (window.MountainEdgeSiteContact && window.MountainEdgeSiteContact.telephoneDisplay) {
      return window.MountainEdgeSiteContact.telephoneDisplay;
    }
    return '(702) 919-5002';
  }

  function failureMessage() {
    return (
      'Sorry, something went wrong sending your message. Please call or text Dr. Jan Duffy at ' +
      getPhoneDisplay() +
      '.'
    );
  }

  function readFormValues(form) {
    const data = new FormData(form);
    const values = {};
    data.forEach(function (value, key) {
      values[key] = value;
    });

    if (!values.name && form.querySelector('#name')) {
      values.name = form.querySelector('#name').value;
    }
    if (!values.email && form.querySelector('#email')) {
      values.email = form.querySelector('#email').value;
    }
    if (!values.phone && form.querySelector('#phone')) {
      values.phone = form.querySelector('#phone').value;
    }
    if (!values.message && form.querySelector('#message')) {
      values.message = form.querySelector('#message').value;
    }

    const name =
      values.name ||
      values.fullName ||
      [values.firstName, values.lastName].filter(Boolean).join(' ').trim();

    return {
      name: name || '',
      email: values.email || values.Email || '',
      phone: values.phone || values.tel || values.phoneNumber || '',
      message: values.message || values.notes || values.comment || '',
      interest: values.interest || '',
      neighborhood: values.neighborhood || '',
      propertyAddress: values.propertyAddress || values.address || '',
      propertyId: values.propertyId || '',
      type:
        form.getAttribute('data-lead-type') ||
        form.getAttribute('data-fub-type') ||
        (form.classList.contains('contact-form') ? 'Property Inquiry' : 'General Inquiry'),
      formName:
        form.getAttribute('data-form-name') ||
        form.getAttribute('data-description') ||
        (document.title.indexOf('|') > -1
          ? document.title.split('|')[0].trim()
          : 'Website Form'),
      sourceUrl: window.location.href,
    };
  }

  function showSuccess(form) {
    var container = form.parentElement;
    var successHtml =
      '<div class="form-success">' +
      '<div class="success-icon-container"><i class="fas fa-check-circle pulse"></i></div>' +
      '<h3 class="slide-in">Thank You!</h3>' +
      '<p class="fade-in">Your request has been submitted successfully. Dr. Jan Duffy will contact you very soon!</p>' +
      '</div>';
    if (form.classList.contains('contact-form')) {
      form.innerHTML = successHtml;
    } else {
      var messageEl = form.querySelector('.form-message');
      if (messageEl) {
        messageEl.className = 'form-message success';
        messageEl.innerHTML = '<i class="fas fa-check-circle"></i> Thank you! Your message has been sent.';
        messageEl.style.display = 'flex';
      } else if (container) {
        form.style.display = 'none';
        var wrap = document.createElement('div');
        wrap.innerHTML = successHtml;
        container.insertBefore(wrap.firstChild, form.nextSibling);
      }
    }
  }

  function showError(form, text) {
    var messageEl = form.querySelector('.form-message');
    if (messageEl) {
      messageEl.className = 'form-message error';
      messageEl.innerHTML = '<i class="fas fa-exclamation-circle"></i> ' + text;
      messageEl.style.display = 'flex';
      messageEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      return;
    }
    alert(text);
  }

  function handleSubmit(event) {
    event.preventDefault();
    var form = event.target;
    var submitBtn = form.querySelector('button[type="submit"], input[type="submit"]');
    var originalBtnHtml = submitBtn ? submitBtn.innerHTML : '';

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    }

    var payload = readFormValues(form);

    fetch('/api/lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
      .then(function (response) {
        if (!response.ok) {
          throw new Error('Lead submit failed');
        }
        showSuccess(form);
      })
      .catch(function () {
        showError(form, failureMessage());
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnHtml;
        }
      });
  }

  function bindLeadForms() {
    var selector = 'form[data-fub="true"], form[data-lead="true"], form.contact-form';
    document.querySelectorAll(selector).forEach(function (form) {
      if (form.dataset.leadBound === 'true') {
        return;
      }
      form.dataset.leadBound = 'true';
      form.addEventListener('submit', handleSubmit);
    });
  }

  document.addEventListener('DOMContentLoaded', bindLeadForms);

  window.MountainEdgeLeadForm = { bindLeadForms: bindLeadForms };
})();
