let doctorId = new URLSearchParams(window.location.search).get("id");
let doctorData;

var xmlHttp = new XMLHttpRequest();
xmlHttp.onreadystatechange = function () {
  if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
    var str = xmlHttp.responseText;
    implementData(str);
  }
};
xmlHttp.open("GET", "./Js/doctorexamplejason.json", false);
xmlHttp.send();

function implementData(d) {
  var jsonData = JSON.parse(d);
  var doctors = jsonData.doctors;
  doctors.forEach(doctor => {
    if (doctor.ID == doctorId) {   
      doctorData = doctor;
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("reservation-form");

  let email = localStorage.getItem("email");
  let username = localStorage.getItem("username");

  if (!email) {
    window.location.href = "login.html";
    return;
  }

  var patientNameInput = document.getElementById("patientName");
  patientNameInput.defaultValue = username || "";

  let patientEmail = document.getElementById("patientEmail");
  patientEmail.textContent = email;

  document.getElementById("doctorName").textContent = doctorData.name;
  document.getElementById("Price").textContent = doctorData.Fees;
  document.getElementById("location").textContent =
    doctorData.clinic.location.govern + " , " +
    doctorData.clinic.location.city + " , " +
    doctorData.clinic.location.street + " , " +
    doctorData.clinic.location.block;

  let doctorWDaysInput = document.getElementById("workigDays");
  doctorData.clinic.schedule.workingDays.forEach(day => {
    doctorWDaysInput.textContent += day + " ";
  });

  let workingHours = document.getElementById("workingHours");
  let hours = doctorData.clinic.schedule.workingHours;
  workingHours.textContent = hours.startingHours + " - " + hours.closingHours;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const appointmentDate = document.getElementById("appointmentTime").value;

    if (!appointmentDate) {
      alert("Please select a date for the appointment!");
      return;
    }

    const book = {
      doctorID: doctorId,
      bookingDate: new Date(appointmentDate).toLocaleDateString(),
      bookingTime: new Date().toLocaleTimeString(),
      status: "reserved"
    };

    fetch("http://localhost:3000/users")
      .then(res => res.json())
      .then(users => {
        let userData = users.find(u => u.email === email);

        if (!userData) {
          alert("User not found!");
          return;
        }

        userData.bookings.push(book);

        return fetch(`http://localhost:3000/users/${userData.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ bookings: userData.bookings })
        });
      })
      .then(res => {
        if (!res || !res.ok) throw new Error("Failed to save booking");
        return res.json();
      })
      .then(() => {
        //alert("Reservation confirmed!");
        window.location.href = "bookings.html";
      })
      .catch(err => {
        console.error("Error saving booking:", err);
        alert("Something went wrong.");
      });
  });
});
