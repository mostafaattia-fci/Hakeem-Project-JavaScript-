document.addEventListener("DOMContentLoaded", function () {
  let doctorId = new URLSearchParams(window.location.search).get("id");
  if (!doctorId) return;

  fetch("./Js/doctorexamplejason.json")
    .then(res => res.json())
    .then(data => {
      let doctor = data.doctors.find(d => d.ID == doctorId);
      if (!doctor) return;

      document.title = doctor.name; // تحديث العنوان
      let container = document.querySelector(".doctordataBox");

      container.appendChild(createDoctorCard(doctor));
      container.appendChild(createDoctorInfo(doctor));
      container.appendChild(createServices(doctor));
      container.appendChild(createDoctorReserve(doctor));
      container.appendChild(createReviews(doctor));
    })
    .catch(err => console.error("Error loading doctor:", err));
});

/* ===== Create Doctor Card ===== */
function createDoctorCard(doctor) {
  let card = document.createElement("div");
  card.className = "doctorCardBox";

  card.innerHTML = `
    <div class="doctorImageBox">
      <img src="${doctor.imageURL}" alt="${doctor.name}">
    </div>
    <div class="doctorTextInfo">
      <h2 class="doctorName">${doctor.name}</h2>
      <p class="doctorSpeciality">${doctor.speciality}</p>
      <p class="doctorRate">⭐ ${doctor.rating.overallRate} 
        (${doctor.rating.numberOfPeopleRating} Reviews)</p>
      <p class="doctorFees">Fees: ${doctor.Fees}</p>
    </div>
  `;
  return card;
}

/* ===== Doctor Info ===== */
function createDoctorInfo(doctor) {
  let box = document.createElement("div");
  box.className = "doctorInfoBox";

  box.innerHTML = `
    <h3 class="sectionTitle">About Doctor</h3>
    <p class="doctorSummary">${doctor.summary}</p>
  `;
  return box;
}

/* ===== Services ===== */
function createServices(doctor) {
  let box = document.createElement("div");
  box.className = "doctorServicesBox";

  let servicesHtml = doctor.clinic.offers.map(s => `<li>${s}</li>`).join("");

  box.innerHTML = `
    <h3 class="sectionTitle">Services</h3>
    <ul class="servicesList">${servicesHtml}</ul>
  `;
  return box;
}

/* ===== Reservation ===== */
function createDoctorReserve(doctor) {
  let box = document.createElement("div");
  box.className = "doctorReserveBox";

  box.innerHTML = `
    <button class="reserveBtn" onclick="window.location.href='reservation.html?id=${doctor.ID}'">
      Book Appointment with ${doctor.name}
    </button>
  `;
  return box;
}

/* ===== Reviews ===== */
function createReviews(doctor) {
  let box = document.createElement("div");
  box.className = "doctorReviewsBox";

  let reviewsHtml = doctor.reviews.map(r => `
    <div class="reviewItem">
      <div class="reviewHeader">
        <span class="reviewAuthor">${r.auther || r.reviewer}</span>
        <span class="reviewRating">⭐ ${r.rating}</span>
      </div>
      <p class="reviewText">${r.content || r.comment}</p>
    </div>
  `).join("");

  box.innerHTML = `
    <h3 class="sectionTitle">Reviews</h3>
    <div class="reviewsList">${reviewsHtml}</div>
  `;
  return box;
}
