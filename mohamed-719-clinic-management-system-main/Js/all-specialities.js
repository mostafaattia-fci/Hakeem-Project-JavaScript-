

var xhr = new XMLHttpRequest();
xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
        var data = JSON.parse(xhr.responseText);
        var doctors = Array.isArray(data) ? data : (data && data.doctors) ? data.doctors : [];

        var container = document.getElementById("doctor-content");
        var pagination = document.getElementById("pagination");
        if (!container) {
            console.warn("Container #doctor-content not found");
            return;
        }

        // pagination
        let currentPage = 1;
        const doctorsPerPage = 5; //number of doctor in bage
        // function to show doctor
        function renderDoctors(page) {
            container.innerHTML = "";
            let start = (page - 1) * doctorsPerPage;
            let end = start + doctorsPerPage;
            let doctorsToShow = doctors.slice(start, end);

            doctorsToShow.forEach(doctor => {
                var div = document.createElement("div");
                div.setAttribute("id", "list-div");
                var name = doctor && doctor.name ? doctor.name : "Unknown";
                var speciality = doctor && doctor.speciality ? doctor.speciality : {};
                var subSpecs = (typeof speciality !== "string" && speciality.SubSpeciality) ? speciality.SubSpeciality : "N/A";
                div.innerHTML = `
                <div class="doctor-card">
                    <div class="coner">
                        <img src="${doctor.imageURL}" alt="Description of image" calss="doctorImg">
                    </div>
                    <div class="coner">
                        <h3>${name}</h3>
                        <p>Speciality: ${doctor.speciality}</p>
                        <div class="stars">
                            <ul class="list-star">
                                <li><i class="fa-solid fa-star"></i></li>
                                <li><i class="fa-solid fa-star"></i></li>
                                <li><i class="fa-solid fa-star"></i></li>
                                <li><i class="fa-solid fa-star"></i></li>
                                <li><i class="fa-solid fa-star"></i></li>
                            </ul>
                        </div>
                        <div class="numberOfPeopleRating"> Number Of People Rating ${doctor.rating.numberOfPeopleRating}</div>
                        <div>
                            <ul>
                                <li><i class="fas fa-stethoscope"></i> ${doctor.summary}</li>
                                <li><i class="fa-solid fa-location-dot"></i> ${doctor.clinic.location.govern}, ${doctor.clinic.location.city}, ${doctor.clinic.location.street}</li>
                                <li><i class="fa-solid fa-money-bill-wave"></i> ${doctor.Fees}</li>
                                <li><i class="fa-solid fa-phone"></i><a href="tel:+201234567890">+201234567890</a> - Cost of regular call</li>
                            </ul>
                        </div>
                    </div>
                    <div class="coner" id="btn-32">
                        <div>
                            <button class="btnof reservationof" doctorId=${doctor.ID} onclick="reserve(event)">Reservation</button>
                            <button class="btnof detailsof" doctorId=${doctor.ID} onclick="showProfile(event)">More Details</button>
                        </div>
                    </div>
                </div>
                `;
                container.appendChild(div);
            });
        }
        // function pagination
        function renderPagination() {
            pagination.innerHTML = "";
            let totalPages = Math.ceil(doctors.length / doctorsPerPage);

            for (let i = 1; i <= totalPages; i++) {
                let btn = document.createElement("button");
                btn.innerText = i;
                btn.classList.add("page-btn");
                if (i === currentPage) btn.classList.add("active");

                btn.addEventListener("click", function () {
                    currentPage = i;
                    renderDoctors(currentPage);
                    renderPagination();
                });

                pagination.appendChild(btn);
            }
        }

        //first bage
        renderDoctors(currentPage);
        renderPagination();
    }
};
xhr.onerror = function () {
    console.error("Network error while fetching the JSON file.");
};
xhr.open("GET", "./js/doctorexamplejason.json", true);
xhr.send();

function reserve(event){
    let id = event.currentTarget.getAttribute("doctorId")
    console.log(id)
    window.location.href="reservation.html?id="+Number(id)
}
function showProfile(event){
    let id = event.currentTarget.getAttribute("doctorId")
    window.location.href="doctor-profile.html?id="+Number(id)

}