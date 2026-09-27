
document.addEventListener('DOMContentLoaded', function() {
    // Initialize enhanced forms
    initializeEnhancedForms();
    
    // Form validation
    setupFormValidation();
    
    // Handle form submissions
    setupFormSubmissions();
});

function initializeEnhancedForms() {
    // Add focus/blur effects for inputs
    const formInputs = document.querySelectorAll('.enhanced-form input, .enhanced-form textarea, .enhanced-form select');
    
    formInputs.forEach(input => {
        // Add focus class to parent on focus
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('input-focused');
        });
        
        // Remove focus class from parent on blur
        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('input-focused');
            
            // Add has-value class if the input has a value
            if (this.value.trim() !== '') {
                this.classList.add('has-value');
            } else {
                this.classList.remove('has-value');
            }
        });
        
        // Check initial state
        if (input.value.trim() !== '') {
            input.classList.add('has-value');
        }
    });
    
    // Initialize custom select boxes
    initCustomSelects();
}

function setupFormValidation() {
    const forms = document.querySelectorAll('.enhanced-form');
    
    forms.forEach(form => {
        const inputs = form.querySelectorAll('input, textarea, select');
        
        inputs.forEach(input => {
            if (input.hasAttribute('required')) {
                // Custom validation on blur
                input.addEventListener('blur', function() {
                    validateInput(this);
                });
                
                // Remove error on focus
                input.addEventListener('focus', function() {
                    this.classList.remove('input-error');
                    
                    // Remove error message if it exists
                    const errorMsg = this.parentElement.querySelector('.error-message');
                    if (errorMsg) {
                        errorMsg.remove();
                    }
                });
            }
        });
    });
}

function validateInput(input) {
    let isValid = true;
    let errorMessage = '';
    
    // Check if input is empty
    if (input.value.trim() === '') {
        isValid = false;
        errorMessage = 'This field is required';
    } else {
        // Email validation
        if (input.type === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(input.value.trim())) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            }
        }
        
        // Phone validation
        if (input.type === 'tel') {
            const phoneRegex = /^[\d\s\-\+\(\)]{10,15}$/;
            if (input.value.trim() !== '' && !phoneRegex.test(input.value.trim())) {
                isValid = false;
                errorMessage = 'Please enter a valid phone number';
            }
        }
    }
    
    // Update UI based on validation
    if (!isValid) {
        input.classList.add('input-error');
        
        // Add error message
        const existingError = input.parentElement.querySelector('.error-message');
        if (!existingError) {
            const errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            errorElement.textContent = errorMessage;
            input.parentElement.appendChild(errorElement);
        }
    } else {
        input.classList.remove('input-error');
        
        // Remove error message if it exists
        const errorMsg = input.parentElement.querySelector('.error-message');
        if (errorMsg) {
            errorMsg.remove();
        }
    }
    
    return isValid;
}

function setupFormSubmissions() {
    const forms = document.querySelectorAll('.enhanced-form');
    
    forms.forEach(form => {
        if (
            form.matches('[data-fub="true"], [data-lead="true"], .contact-form') ||
            form.id === 'login-form' ||
            form.id === 'request-form'
        ) {
            return;
        }

        form.addEventListener('submit', function(e) {
            const requiredInputs = form.querySelectorAll('[required]');
            let formIsValid = true;
            
            requiredInputs.forEach(input => {
                if (!validateInput(input)) {
                    formIsValid = false;
                }
            });
            
            if (!formIsValid) {
                e.preventDefault();
            }
        });
    });
}

function showFormMessage(form, type, message) {
    const messageElement = form.querySelector('.form-message');
    
    if (messageElement) {
        messageElement.className = 'form-message ' + type;
        messageElement.innerHTML = type === 'success' 
            ? `<i class="fas fa-check-circle"></i> ${message}`
            : `<i class="fas fa-exclamation-circle"></i> ${message}`;
        
        messageElement.style.display = 'flex';
        
        // Scroll to message
        messageElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        
        // Hide the message after some time
        if (type === 'success') {
            setTimeout(() => {
                messageElement.style.display = 'none';
            }, 5000);
        }
    }
}

function initCustomSelects() {
    const selects = document.querySelectorAll('.enhanced-form select:not(.initialized)');
    
    selects.forEach(select => {
        select.classList.add('initialized');
        
        // Add change listener to update styling based on selection
        select.addEventListener('change', function() {
            if (this.value) {
                this.classList.add('has-value');
            } else {
                this.classList.remove('has-value');
            }
        });
        
        // Check initial state
        if (select.value) {
            select.classList.add('has-value');
        }
    });
}
// Form Enhancement JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Apply enhanced styling to all forms
    enhanceForms();
    
    // Set up form validation
    setupFormValidation();
    
    // Add interactive feedback
    setupFormFeedback();
    
    // Initialize datepickers if any
    initDatepickers();
    
    // Initialize autocomplete for address fields
    initAddressAutocomplete();
});

// Main form enhancement function
function enhanceForms() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        // Add enhanced classes
        form.classList.add('enhanced-form');
        
        // Style form elements
        styleFormElements(form);
        
        // Add accessibility attributes
        addAccessibilityFeatures(form);
        
        // Add progress indicator for multi-step forms
        if (form.classList.contains('multi-step-form')) {
            addProgressIndicator(form);
        }
        
        // Add animated labels
        addFloatingLabels(form);
    });
}

// Style individual form elements
function styleFormElements(form) {
    // Style input fields
    const inputs = form.querySelectorAll('input:not([type="checkbox"]):not([type="radio"]), select, textarea');
    inputs.forEach(input => {
        input.classList.add('enhanced-input');
        
        // Create wrapper for styling if not already wrapped
        if (!input.parentElement.classList.contains('input-wrapper')) {
            const wrapper = document.createElement('div');
            wrapper.classList.add('input-wrapper');
            input.parentNode.insertBefore(wrapper, input);
            wrapper.appendChild(input);
        }
    });
    
    // Style checkboxes and radio buttons
    const checkboxesAndRadios = form.querySelectorAll('input[type="checkbox"], input[type="radio"]');
    checkboxesAndRadios.forEach(input => {
        input.classList.add('enhanced-checkbox-radio');
        
        // Create custom styled element
        const wrapper = document.createElement('div');
        wrapper.classList.add('custom-control-wrapper');
        
        const customControl = document.createElement('span');
        customControl.classList.add(input.type === 'checkbox' ? 'custom-checkbox' : 'custom-radio');
        
        input.parentNode.insertBefore(wrapper, input);
        wrapper.appendChild(input);
        wrapper.appendChild(customControl);
    });
    
    // Style submit buttons
    const submitButtons = form.querySelectorAll('button[type="submit"], input[type="submit"]');
    submitButtons.forEach(button => {
        button.classList.add('enhanced-button');
    });
}

// Form validation setup
function setupFormValidation() {
    const forms = document.querySelectorAll('form.enhanced-form');
    
    forms.forEach(form => {
        // Add client-side validation
        form.addEventListener('submit', function(event) {
            if (!validateForm(form)) {
                event.preventDefault();
            }
        });
        
        // Real-time validation on input
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(input);
            });
            
            // Clear error state when user starts typing again
            input.addEventListener('input', function() {
                if (input.classList.contains('error')) {
                    input.classList.remove('error');
                    const errorElement = input.parentElement.querySelector('.error-message');
                    if (errorElement) {
                        errorElement.remove();
                    }
                }
            });
        });
    });
}

// Validate an entire form
function validateForm(form) {
    let isValid = true;
    const inputs = form.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
        if (!validateField(input)) {
            isValid = false;
        }
    });
    
    return isValid;
}

// Validate a single field
function validateField(field) {
    // Remove any existing error messages
    const existingError = field.parentElement.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    field.classList.remove('error');
    
    let isValid = true;
    let errorMessage = '';
    
    // Required field validation
    if (field.hasAttribute('required') && !field.value.trim()) {
        isValid = false;
        errorMessage = 'This field is required';
    }
    
    // Email validation
    if (field.type === 'email' && field.value && !validateEmail(field.value)) {
        isValid = false;
        errorMessage = 'Please enter a valid email address';
    }
    
    // Phone validation
    if (field.type === 'tel' && field.value && !validatePhone(field.value)) {
        isValid = false;
        errorMessage = 'Please enter a valid phone number';
    }
    
    // Custom data-pattern validation
    if (field.dataset.pattern && field.value) {
        const pattern = new RegExp(field.dataset.pattern);
        if (!pattern.test(field.value)) {
            isValid = false;
            errorMessage = field.dataset.errorMessage || 'Invalid format';
        }
    }
    
    // Min/max length validation
    if (field.value && field.minLength > 0 && field.value.length < field.minLength) {
        isValid = false;
        errorMessage = `Must be at least ${field.minLength} characters`;
    }
    
    if (field.value && field.maxLength > 0 && field.value.length > field.maxLength) {
        isValid = false;
        errorMessage = `Cannot exceed ${field.maxLength} characters`;
    }
    
    // Show error message if invalid
    if (!isValid) {
        field.classList.add('error');
        
        const errorElement = document.createElement('div');
        errorElement.classList.add('error-message');
        errorElement.textContent = errorMessage;
        field.parentElement.appendChild(errorElement);
    }
    
    return isValid;
}

// Email validation helper
function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

// Phone validation helper
function validatePhone(phone) {
    const re = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
    return re.test(String(phone));
}

// Add accessibility features to forms
function addAccessibilityFeatures(form) {
    // Ensure all form controls have associated labels
    const formControls = form.querySelectorAll('input, select, textarea');
    
    formControls.forEach(control => {
        // Skip hidden inputs
        if (control.type === 'hidden') return;
        
        // Check if control has an id
        if (!control.id) {
            control.id = 'form-control-' + Math.random().toString(36).substr(2, 9);
        }
        
        // Check if control has a label
        const hasLabel = Array.from(form.querySelectorAll('label')).some(label => 
            label.htmlFor === control.id
        );
        
        if (!hasLabel) {
            // Create a label if none exists
            const label = document.createElement('label');
            label.htmlFor = control.id;
            
            // Try to use placeholder or name as label text
            let labelText = control.placeholder || control.name || control.id;
            labelText = labelText.charAt(0).toUpperCase() + labelText.slice(1).replace(/([A-Z])/g, ' $1').replace(/_/g, ' ');
            
            label.textContent = labelText;
            
            // Insert label before the control or its wrapper
            const wrapper = control.closest('.input-wrapper') || control;
            wrapper.parentNode.insertBefore(label, wrapper);
        }
        
        // Add ARIA attributes
        if (control.required) {
            control.setAttribute('aria-required', 'true');
        }
        
        if (control.classList.contains('error')) {
            control.setAttribute('aria-invalid', 'true');
        } else {
            control.setAttribute('aria-invalid', 'false');
        }
    });
    
    // Add ARIA roles to form sections if needed
    const formSections = form.querySelectorAll('fieldset, .form-section');
    formSections.forEach((section, index) => {
        section.setAttribute('role', 'group');
        
        // Add ARIA labelledby if there's a legend or heading
        const heading = section.querySelector('legend, h2, h3, h4, h5, h6');
        if (heading) {
            if (!heading.id) {
                heading.id = 'section-heading-' + index;
            }
            section.setAttribute('aria-labelledby', heading.id);
        }
    });
}

// Setup interactive form feedback
function setupFormFeedback() {
    const forms = document.querySelectorAll('form.enhanced-form');
    
    forms.forEach(form => {
        // Show loading indicator on submit
        form.addEventListener('submit', function(event) {
            if (validateForm(form)) {
                showLoadingIndicator(form);
            }
        });
        
        // Add feedback indicators to inputs
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('input', function() {
                if (input.value.trim()) {
                    input.classList.add('has-content');
                } else {
                    input.classList.remove('has-content');
                }
            });
            
            // Trigger input event to set initial state
            const event = new Event('input');
            input.dispatchEvent(event);
        });
    });
}

// Show loading indicator
function showLoadingIndicator(form) {
    const submitButton = form.querySelector('button[type="submit"], input[type="submit"]');
    
    if (submitButton) {
        // Store original text
        submitButton.dataset.originalText = submitButton.textContent || submitButton.value;
        
        // Disable button
        submitButton.disabled = true;
        
        // Add loading animation
        if (submitButton.tagName === 'INPUT') {
            submitButton.value = 'Submitting...';
        } else {
            submitButton.innerHTML = '<span class="loading-spinner"></span> Submitting...';
        }
    }
}

// Add floating labels to form inputs
function addFloatingLabels(form) {
    // Only apply to forms with the floating-labels class
    if (!form.classList.contains('floating-labels')) {
        return;
    }
    
    const inputs = form.querySelectorAll('input:not([type="checkbox"]):not([type="radio"]), select, textarea');
    
    inputs.forEach(input => {
        const wrapper = document.createElement('div');
        wrapper.classList.add('floating-label-wrapper');
        
        // Get associated label
        let label = null;
        if (input.id) {
            label = form.querySelector(`label[for="${input.id}"]`);
        }
        
        // If no label exists, create one
        if (!label) {
            label = document.createElement('label');
            label.htmlFor = input.id || 'floating-input-' + Math.random().toString(36).substr(2, 9);
            
            if (!input.id) {
                input.id = label.htmlFor;
            }
            
            label.textContent = input.placeholder || input.name || '';
            input.placeholder = '';
        } else {
            // Remove existing label from DOM as we'll reinsert it
            label.remove();
        }
        
        // Set up the wrapper with input and label
        input.parentNode.insertBefore(wrapper, input);
        wrapper.appendChild(input);
        wrapper.appendChild(label);
        
        // Add active class if input has value
        if (input.value.trim()) {
            wrapper.classList.add('active');
        }
        
        // Add event listeners to handle class toggling
        input.addEventListener('focus', function() {
            wrapper.classList.add('active');
        });
        
        input.addEventListener('blur', function() {
            if (!input.value.trim()) {
                wrapper.classList.remove('active');
            }
        });
    });
}

// Add progress indicator for multi-step forms
function addProgressIndicator(form) {
    const steps = form.querySelectorAll('.form-step');
    if (steps.length <= 1) return;
    
    // Create progress bar container
    const progressContainer = document.createElement('div');
    progressContainer.classList.add('form-progress-container');
    
    // Create progress bar
    const progressBar = document.createElement('div');
    progressBar.classList.add('form-progress-bar');
    
    // Create steps indicators
    const stepsContainer = document.createElement('div');
    stepsContainer.classList.add('form-steps-indicators');
    
    steps.forEach((step, index) => {
        // Create step indicator
        const stepIndicator = document.createElement('div');
        stepIndicator.classList.add('step-indicator');
        
        // Add step number
        const stepNumber = document.createElement('span');
        stepNumber.classList.add('step-number');
        stepNumber.textContent = index + 1;
        
        // Add step label if available
        const stepTitle = step.getAttribute('data-title') || `Step ${index + 1}`;
        const stepLabel = document.createElement('span');
        stepLabel.classList.add('step-label');
        stepLabel.textContent = stepTitle;
        
        // Assemble step indicator
        stepIndicator.appendChild(stepNumber);
        stepIndicator.appendChild(stepLabel);
        
        // Mark current step
        if (index === 0) {
            stepIndicator.classList.add('active');
        }
        
        stepsContainer.appendChild(stepIndicator);
    });
    
    // Assemble progress container
    progressContainer.appendChild(stepsContainer);
    progressContainer.appendChild(progressBar);
    
    // Add progress bar to form before the first step
    form.insertBefore(progressContainer, steps[0]);
    
    // Update progress bar based on current step
    updateFormProgress(form, 0);
    
    // Set up navigation buttons
    setupMultiStepNavigation(form, steps.length);
}

// Update progress bar
function updateFormProgress(form, currentStep) {
    const totalSteps = form.querySelectorAll('.form-step').length;
    const progress = (currentStep / (totalSteps - 1)) * 100;
    
    const progressBar = form.querySelector('.form-progress-bar');
    if (progressBar) {
        progressBar.style.width = `${progress}%`;
    }
    
    // Update step indicators
    const stepIndicators = form.querySelectorAll('.step-indicator');
    stepIndicators.forEach((indicator, index) => {
        if (index < currentStep) {
            indicator.classList.add('completed');
            indicator.classList.remove('active');
        } else if (index === currentStep) {
            indicator.classList.add('active');
            indicator.classList.remove('completed');
        } else {
            indicator.classList.remove('active', 'completed');
        }
    });
}

// Setup multi-step form navigation
function setupMultiStepNavigation(form, totalSteps) {
    let currentStep = 0;
    
    // Show only the first step initially
    const steps = form.querySelectorAll('.form-step');
    steps.forEach((step, index) => {
        if (index !== 0) {
            step.style.display = 'none';
        }
        
        // Add navigation buttons if they don't exist
        if (!step.querySelector('.form-nav-buttons')) {
            const navButtons = document.createElement('div');
            navButtons.classList.add('form-nav-buttons');
            
            // Back button (hide on first step)
            if (index > 0) {
                const backButton = document.createElement('button');
                backButton.type = 'button';
                backButton.classList.add('btn-prev-step');
                backButton.textContent = 'Previous';
                navButtons.appendChild(backButton);
            }
            
            // Next/Submit button
            const nextButton = document.createElement('button');
            nextButton.type = (index === totalSteps - 1) ? 'submit' : 'button';
            nextButton.classList.add((index === totalSteps - 1) ? 'btn-submit' : 'btn-next-step');
            nextButton.textContent = (index === totalSteps - 1) ? 'Submit' : 'Next';
            navButtons.appendChild(nextButton);
            
            step.appendChild(navButtons);
        }
    });
    
    // Add event listeners to navigation buttons
    form.querySelectorAll('.btn-next-step').forEach(button => {
        button.addEventListener('click', function() {
            // Validate only fields in the current step
            const currentStepElement = steps[currentStep];
            const currentFields = currentStepElement.querySelectorAll('input, select, textarea');
            
            let isCurrentStepValid = true;
            currentFields.forEach(field => {
                if (!validateField(field)) {
                    isCurrentStepValid = false;
                }
            });
            
            if (isCurrentStepValid) {
                // Hide current step
                steps[currentStep].style.display = 'none';
                
                // Show next step
                currentStep++;
                steps[currentStep].style.display = 'block';
                
                // Update progress indicator
                updateFormProgress(form, currentStep);
                
                // Scroll to top of form
                form.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
    
    form.querySelectorAll('.btn-prev-step').forEach(button => {
        button.addEventListener('click', function() {
            // Hide current step
            steps[currentStep].style.display = 'none';
            
            // Show previous step
            currentStep--;
            steps[currentStep].style.display = 'block';
            
            // Update progress indicator
            updateFormProgress(form, currentStep);
            
            // Scroll to top of form
            form.scrollIntoView({ behavior: 'smooth' });
        });
    });
}

// Initialize datepickers
function initDatepickers() {
    // If Flatpickr is available
    if (typeof flatpickr === 'function') {
        const dateInputs = document.querySelectorAll('input[type="date"], input.datepicker');
        
        dateInputs.forEach(input => {
            // Get options from data attributes
            const options = {
                dateFormat: 'm/d/Y',
                minDate: input.getAttribute('min') || '',
                maxDate: input.getAttribute('max') || '',
                allowInput: true
            };
            
            flatpickr(input, options);
        });
    }
}

// Initialize address autocomplete
function initAddressAutocomplete() {
    // Check if Google Places API is available
    if (typeof google !== 'undefined' && typeof google.maps !== 'undefined' && typeof google.maps.places !== 'undefined') {
        const addressInputs = document.querySelectorAll('input[data-address-autocomplete]');
        
        addressInputs.forEach(input => {
            const autocomplete = new google.maps.places.Autocomplete(input, {
                componentRestrictions: { country: 'us' },
                fields: ['address_components', 'formatted_address', 'geometry']
            });
            
            // When a place is selected
            autocomplete.addListener('place_changed', function() {
                const place = autocomplete.getPlace();
                
                if (!place.geometry) {
                    return;
                }
                
                // You can extract specific address components if needed
                if (place.address_components) {
                    // Example: Extract zip code
                    const zipComponent = place.address_components.find(component => 
                        component.types.includes('postal_code')
                    );
                    
                    if (zipComponent && input.dataset.zipTarget) {
                        const zipInput = document.getElementById(input.dataset.zipTarget);
                        if (zipInput) {
                            zipInput.value = zipComponent.long_name;
                            // Trigger change event
                            const event = new Event('input');
                            zipInput.dispatchEvent(event);
                        }
                    }
                    
                    // Example: Extract state
                    const stateComponent = place.address_components.find(component => 
                        component.types.includes('administrative_area_level_1')
                    );
                    
                    if (stateComponent && input.dataset.stateTarget) {
                        const stateInput = document.getElementById(input.dataset.stateTarget);
                        if (stateInput) {
                            stateInput.value = stateComponent.short_name;
                            // Trigger change event
                            const event = new Event('input');
                            stateInput.dispatchEvent(event);
                        }
                    }
                    
                    // Example: Extract city
                    const cityComponent = place.address_components.find(component => 
                        component.types.includes('locality')
                    );
                    
                    if (cityComponent && input.dataset.cityTarget) {
                        const cityInput = document.getElementById(input.dataset.cityTarget);
                        if (cityInput) {
                            cityInput.value = cityComponent.long_name;
                            // Trigger change event
                            const event = new Event('input');
                            cityInput.dispatchEvent(event);
                        }
                    }
                }
            });
        });
    }
}

// Show successful form submission message
function showSuccessMessage(form, message) {
    // Create success message element
    const successElement = document.createElement('div');
    successElement.classList.add('form-success-message');
    successElement.innerHTML = `<i class="fas fa-check-circle"></i><h3>${message || 'Form submitted successfully!'}</h3>`;
    
    // Hide the form
    form.style.display = 'none';
    
    // Insert success message
    form.parentNode.insertBefore(successElement, form.nextSibling);
    
    // Add animation
    setTimeout(() => {
        successElement.classList.add('show');
    }, 100);
}
