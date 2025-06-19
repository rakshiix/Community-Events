    let formUnsaved = false;
    function markFormAsUnsaved() {
        formUnsaved = true;
    }

    document.addEventListener('DOMContentLoaded', (event) => {
        const registrationForm = document.getElementById('registration-form');
        const feedbackForm = document.getElementById('feedback-section');

        registrationForm.querySelectorAll('input, select, textarea').forEach(element => {
            element.addEventListener('input', markFormAsUnsaved);
        });

        feedbackForm.querySelectorAll('input, select, textarea').forEach(element => {
            element.addEventListener('input', markFormAsUnsaved);
        });
        loadEventTypePreference();
    });

    function showConfirmation() {
      const name = document.getElementById('fullName').value;
      const email = document.getElementById('email').value;
      const eventType = document.getElementById('eventType').value;
      const eventDate = document.getElementById('eventDate').value;
      const message = document.getElementById('message').value;
      const confirmationOutput = document.getElementById('confirmationMessage');

      let eventTypeName = '';
      switch(eventType) {
        case 'community_picnic': eventTypeName = 'Community Picnic'; break;
        case 'art_fair': eventTypeName = 'Local Art Fair'; break;
        case 'summer_concert': eventTypeName = 'Summer Concert Series'; break;
        case 'park_cleanup': eventTypeName = 'Park Clean-up Day'; break;
        case 'coding_workshop': eventTypeName = 'Coding Workshop'; break;
        case 'farmers_market': eventTypeName = 'Farmers Market'; break;
        case 'other': eventTypeName = 'Other Event'; break;
        default: eventTypeName = 'an unspecified event';
      }

      confirmationOutput.innerHTML = `
        <p>Thank you, <span class="highlight">${name}</span>, for registering!</p>
        <p>A confirmation email has been sent to <span class="highlight">${email}</span>.</p>
        <p>You have registered for <span class="highlight">${eventTypeName}</span> on <span class="highlight">${eventDate}</span>.</p>
        ${message ? `<p>Your message: "${message}"</p>` : ''}
      `;
      confirmationOutput.style.display = 'block';

      document.getElementById('fullName').value = '';
      document.getElementById('email').value = '';
      document.getElementById('eventDate').value = '';
      document.getElementById('eventType').value = '';
      document.getElementById('message').value = '';
      formUnsaved = false;
    }

    function validatePhoneNumber() {
        const phoneInput = document.getElementById('phone');
        const phoneValidationMessage = document.getElementById('phoneValidationMessage');
        const phonePattern = /^(\d{3}-\d{3}-\d{4}|\d{10})$/;

        if (phoneInput.value === '') {
            phoneValidationMessage.style.display = 'none';
            phoneValidationMessage.classList.remove('error');
            phoneValidationMessage.innerHTML = '';
            return;
        }

        if (phonePattern.test(phoneInput.value)) {
            phoneValidationMessage.innerHTML = 'Phone number is valid.';
            phoneValidationMessage.style.display = 'block';
            phoneValidationMessage.classList.remove('error');
        } else {
            phoneValidationMessage.innerHTML = 'Invalid phone number format. Use XXX-XXX-XXXX or XXXXXXXXXX.';
            phoneValidationMessage.style.display = 'block';
            phoneValidationMessage.classList.add('error');
        }
    }

    function displayEventFee() {
        const eventFeeSelect = document.getElementById('eventFee');
        const eventFeeDisplay = document.getElementById('eventFeeDisplay');
        const selectedOption = eventFeeSelect.options[eventFeeSelect.selectedIndex];
        const fee = selectedOption.value;
        const eventName = selectedOption.text;

        if (fee === '') {
            eventFeeDisplay.style.display = 'none';
            eventFeeDisplay.innerHTML = '';
        } else if (fee === '0') {
            eventFeeDisplay.innerHTML = `The selected event (${eventName}) is: <span class="highlight">Free!</span>`;
            eventFeeDisplay.style.display = 'block';
        } else {
            eventFeeDisplay.innerHTML = `The fee for <span class="highlight">${eventName}</span> is: <span class="highlight">$${fee}</span>`;
            eventFeeDisplay.style.display = 'block';
        }
    }

    function enlargeImage(img) {
        img.classList.toggle('enlarged');
    }

    function countCharacters() {
        const feedbackTextarea = document.getElementById('feedbackTextarea');
        const charCountOutput = document.getElementById('charCount');
        const currentLength = feedbackTextarea.value.length;
        charCountOutput.innerHTML = `${currentLength} characters`;
        charCountOutput.style.display = 'block';
    }

    function showFeedbackConfirmation() {
        const feedbackText = document.getElementById('feedbackTextarea').value;
        const feedbackConfirmationOutput = document.getElementById('feedbackConfirmation');
        if (feedbackText.trim() === '') {
            feedbackConfirmationOutput.innerHTML = '<p style="color: red;">Please provide some feedback before submitting.</p>';
            feedbackConfirmationOutput.style.display = 'block';
            feedbackConfirmationOutput.style.borderColor = '#f44336';
            feedbackConfirmationOutput.style.backgroundColor = '#ffe6e6';
        } else {
            feedbackConfirmationOutput.innerHTML = '<p>Thank you for your valuable feedback!</p>';
            feedbackConfirmationOutput.style.display = 'block';
            feedbackConfirmationOutput.style.borderColor = '#4CAF50';
            feedbackConfirmationOutput.style.backgroundColor = '#e6ffe6';

            document.getElementById('feedbackTextarea').value = '';
            document.getElementById('charCount').innerHTML = '0 characters';
        }
    }

    function videoCanPlay() {
        const videoStatus = document.getElementById('videoStatus');
        videoStatus.innerHTML = 'Video is ready to play! Enjoy the invite.';
        videoStatus.style.color = 'darkgreen';
    }

    function videoEnded() {
        const videoStatus = document.getElementById('videoStatus');
        videoStatus.innerHTML = 'Video invite has ended. We hope to see you there!';
        videoStatus.style.color = 'purple';
        videoWatched = true;
    }

    window.onbeforeunload = function() {
        if (formUnsaved) {
            return "You have unsaved changes in the form. Are you sure you want to leave?";
        }
    };

    function saveEventTypePreference() {
        const eventTypeSelect = document.getElementById('eventType');
        const selectedValue = eventTypeSelect.value;
        if (selectedValue) {
            localStorage.setItem('preferredEventType', selectedValue);
            console.log('Preferred event type saved:', selectedValue);
        } else {
            localStorage.removeItem('preferredEventType');
            console.log('Preferred event type cleared (no selection)');
        }
    }

    function loadEventTypePreference() {
        const eventTypeSelect = document.getElementById('eventType');
        const savedPreference = localStorage.getItem('preferredEventType');
        if (savedPreference) {
            eventTypeSelect.value = savedPreference;
            console.log('Preferred event type loaded:', savedPreference);
        }
    }

    function clearPreferences() {
        localStorage.clear();
        sessionStorage.clear();
        document.getElementById('eventType').value = '';
        alert('All preferences (localStorage and sessionStorage) have been cleared!');
        console.log('All preferences cleared from localStorage and sessionStorage.');
    }

    function findNearbyEvents() {
      const resultDiv = document.getElementById("locationResult");
      resultDiv.textContent = "Detecting your location...";

      if (!navigator.geolocation) {
        resultDiv.textContent = "Geolocation is not supported by your browser.";
        return;
      }
      navigator.geolocation.getCurrentPosition((position) => {
        const latitude = position.coords.latitude.toFixed(5);
        const longitude = position.coords.longitude.toFixed(5);
        resultDiv.innerHTML = `Your location:<br>Latitude: <span style="color:green;">${latitude}</span><br>Longitude: <span style="color:green;">${longitude}</span>`;
      },
      (error) => {
        switch(error.code) {
          case error.PERMISSION_DENIED:
            resultDiv.textContent = "Permission denied. Please allow location access.";
            break;
          case error.POSITION_UNAVAILABLE:
            resultDiv.textContent = "Location information is unavailable.";
            break;
          case error.TIMEOUT:
            resultDiv.textContent = "Location request timed out.";
            break;
          default:
            resultDiv.textContent = "An unknown error occurred.";
            break;
    }},
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        });
    }
