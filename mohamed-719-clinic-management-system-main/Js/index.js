
// AJAX to fetch doctors data
function ajaxGet(url, onSuccess, onError) {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", url, true);

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        try {
          var data = JSON.parse(xhr.responseText);
          onSuccess(data);
        } catch (e) {
          if (onError) onError("JSON Parse Error: " + e.message);
        }
      } else {
        if (onError) onError("Error: " + xhr.status);
      }
    }
  };

  xhr.send();
}

var _autoScrollTimer = null;

/* ====== Load doctors to homepage ====== */
function loadDoctors() {
  var container = document.getElementById('doctors-list');
  if (!container) return;

  ajaxGet('./Js/doctorexamplejason.json', function (data) {
    container.innerHTML = '';

    var doctors = data.doctors;
    console.log(doctors);
    doctors = doctors.filter(e => e.rating.overallRate >= 4.5);

    for (let i = 0; i < doctors.length; i++) {
      var d = doctors[i];
      
      var card = document.createElement('div');
      card.className = 'doctor-card color-' + (i % 10); // add color class
      card.style.cssText=`position: relative;
      width: 250px;
      height: 350px;
      overflow: hidden;
      border-radius: 12px;
      padding= 0;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
      cursor: pointer;`;
      /*
      card.onmouseover(ev=>{
         e.target.style.cssText +="display: inline-block;"
      })*/
      // create img
      var cardImg =document.createElement('img');
      cardImg.className="doctorImg";
      cardImg.src=d.imageURL;
      cardImg.alt=d.name;
      cardImg.style.cssText=`
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
      `;

      var overlay = document.createElement('div');
      overlay.className = "overlay";
      overlay.style.cssText=`
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 100%;
        background: linear-gradient(to top, rgba(244, 244, 253, 0.6), transparent 60%);
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        padding: 20px;
        transition: background 0.3s;
      `;

      var doctorName = document.createElement('h3')
      doctorName.className='docNameH3';
      doctorName.innerText=d.name;
      doctorName.style.cssText =`
      font-size: 1.2em;
      font-weight: bold;
      margin-bottom: 10px;`


      var speciality = document.createElement("p");
      speciality.className="pGroup";
      speciality.innerText=`${d.speciality} - ${d.clinic.location.city} `;
      speciality.style.cssText = `
        font-size: 1.2em;
      font-weight: bold;
      margin-bottom: 10px;
      `

      var Price = document.createElement("p");
      Price.className="pGroup";
      Price.innerText=`${d.Fees} `;
      Price.style.cssText = `
        
      `

      var doctorButton = document.createElement("a");
      doctorButton.className="details-btn";
      doctorButton.href="doctor-profile.html?id="+String(d.ID)
      doctorButton.innerText="Details";
     /* doctorButton.onmouseover((e)=>{
        e.target.style.cssText += "background-color: #fff;"
      })*/

      container.appendChild(card);
      card.appendChild(cardImg);
      card.appendChild(overlay)
      overlay.appendChild(doctorName);
      overlay.appendChild(speciality)
      overlay.appendChild(Price)
      overlay.appendChild(doctorButton)
    }

    initAutoScroll('doctors-list');
  }, function (err) {
    console.error(err);
    container.innerHTML = '<p>Failed to load doctors list.</p>';
  });
}

/* ====== Auto scroll horizontally ====== */
function initAutoScroll(containerId) {
  var holder = document.getElementById(containerId);
  if (!holder) return;

  holder.classList.add("ltr-scroll"); // CSS handles direction
  holder.addEventListener('mouseenter', stopAutoScroll);
  holder.addEventListener('mouseleave', function(){ startAutoScroll(holder); });
  startAutoScroll(holder);
}

function startAutoScroll(holder) {
  stopAutoScroll();

  var step = 100;
  var firstCard = holder.querySelector('.doctor-card');
  if (firstCard) step = firstCard.offsetWidth + 100;

  _autoScrollTimer = setInterval(function () {
    var atEnd = holder.scrollLeft + holder.clientWidth + 5 >= holder.scrollWidth;
    if (atEnd) {
      holder.scrollLeft = 0;
    } else {
      holder.scrollLeft = holder.scrollLeft + step;
    }
  }, 4000);
}

function stopAutoScroll() {
  if (_autoScrollTimer) {
    clearInterval(_autoScrollTimer);
    _autoScrollTimer = null;
  }
}

/* ====== Redirect to doctor details ====== */
function viewDoctor(id) {
  window.location.href = 'doctor.html?id=' + encodeURIComponent(id);
}

/* ====== Load doctor details in doctor.html ====== */
function loadDoctorDetails() {
  var params = new URLSearchParams(window.location.search);
  var id = params.get("id");
  if (!id) return;

  ajaxGet('./Js/doctorexamplejason.json', function (data) {
    var doctors = data.doctors;
    var doctor = doctors.find(d => d.ID == id);
    if (!doctor) return;

    document.getElementById("doctor-details").innerHTML = `
      <img class="doctor-img" src="${doctor.imageURL}" alt="${doctor.name}">
      <h2>${doctor.name}</h2>
      <p><b>Speciality:</b> ${doctor.speciality}</p>
      <p><b>City:</b> ${doctor.clinic.location.city}</p>
      <p><b>Fees:</b> ${doctor.Fees}</p>
      <p><b>Summary:</b> ${doctor.summary}</p>
    `;
  });
}
