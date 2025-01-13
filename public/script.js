//page
let page = 1;

window.addEventListener("load", () => {
  console.log("window loaded");
  getdata(page);
});

function getdata(page, limit) {
  const pageNo = page || 1;
  const pageLimit = limit || 3;
  console.log(pageNo);
  fetch(`/stdload?page=${pageNo}&limit=${pageLimit}`, {
    method: "GET",
  })
    .then((res) => res.json())
    .then((data) => {
      const tablebody = document.getElementById("tablebody");
      if (pageNo == 1) {
        tablebody.innerHTML = ""; // Clear existing content if necessary
      }
      console.log(data);
      if (data.length > 0) {
        if (data.length > 2) {
          document.getElementById("loadmore").style.display = "";
        }
        data.forEach((element) => {
          // Append new rows without overwriting
          tablebody.innerHTML += `<tr id="editstd${element._id}">
                  <td>${element.name}</td>
                  <td>${element.age}</td>
                  <td>${element.course}</td>
                  <td>
                  <button class="edit-btn" id="edit${element._id}" onclick="editbutton('${element._id}','${element.name}',${element.age},'${element.course}')" type="button">Edit</button>
                  <button onclick="deletebutton('${element._id}')" class="delete-btn" type="button">Delete</button>
                  </td>
                </tr>`;
        });
      } else {
        console.log("no data found");
        document.getElementById("loadmore").style.display = "none";
      }
    })
    .catch((error) => console.error(error));
}

document
  .getElementById("student-form")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent form submission

    // Get the values from the input fields
    const name = document.getElementById("name").value;
    const age = document.getElementById("age").value;
    const course = document.getElementById("course").value;

    // Get the hidden student id (if it's an update)
    const studentId = document.getElementById("student-id").value;

    const std_obj = {
      name: name,
      age: age,
      course: course,
    };
    //console.log(std_obj);
    fetch("/insertstd", {
      method: "POST", // Specify POST method since your route is handling POST requests
      headers: {
        "Content-Type": "application/json", // Ensure you're sending JSON if needed
      },
      body: JSON.stringify(std_obj), // Example body for POST request
    })
      .then((res) => res.json()) // Handle response as JSON
      .then((data) => {
        console.log(data);
        getdata(page);
        document.querySelector("form").reset();
      }) // Log the response data
      .catch((error) => console.log("Error:", error)); // Handle errors
  });

//edit button
function editbutton(id, name, age, course) {
  const editstd = document.querySelector("#editstd" + id);
  editstd.innerHTML = `
                  <tr id="editstd${id}">
                  <td><input id="name${id}" type="text" value="${name}" required=""></td>
                  <td><input id="age${id}" type="number" value="${age}" required=""></td>
                  <td><input id="course${id}" type="text" value=${course} required=""></td>
                  <td class="savecancel">
                  <button onclick="updatestd('${id}','${name}',${age},'${course}')" type="button">Update</button>
                  <button onclick="cancelupd('${id}','${name}',${age},'${course}')" class="delete-btn" type="button">Cancel</button>
                  </td>
                  </tr>
               `;
  // console.log(id, name, age, course);
}

// udating students details
function updatestd(id) {
  const name = document.getElementById("name" + id).value;
  const age = document.getElementById("age" + id).value;
  const course = document.getElementById("course" + id).value;
  //console.log(name, age, course);
  const putstd = {
    id: id,
    name: name,
    age: age,
    course: course,
  };

  fetch("/updatestd", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(putstd),
  })
    .then((response) => response.json())
    .then((data) => {
      //console.log(data.student._id);
      const editstd = document.querySelector("#editstd" + data.student._id);
      editstd.innerHTML = `
                      <tr id="editstd${data.student._id}">
                      <td>${data.student.name}</td>
                      <td>${data.student.age}</td>
                      <td>${data.student.course}</td>
                      <td>
                       <button class="edit-btn" id="edit${data.student._id}" onclick="editbutton('${data.student._id}','${data.student.name}',${data.student.age},'${data.student.course}')" type="button">Edit</button>
                       <button onclick="deletebutton('${data.student._id}')" class="delete-btn" type="button">Delete</button>
                      </td>
                      </tr>
                   `;
    })
    .catch((error) => console.error("Error:", error));
}

//cancel button
function cancelupd(id, name, age, course) {
  //console.log(id, name, age, course);
  const editstd = document.querySelector("#editstd" + id);
  editstd.innerHTML = `
                      <tr id="editstd${id}">
                      <td>${name}</td>
                      <td>${age}</td>
                      <td>${course}</td>
                      <td>
                       <button class="edit-btn" id="edit${id}" onclick="editbutton('${id}','${name}',${age},'${course}')" type="button">Edit</button>
                       <button onclick="deletebutton('${id}')"  class="delete-btn" type="button">Delete</button>
                      </td>
                      </tr>
                   `;
}

//delete button
function deletebutton(id) {
  //console.log("delete", id);
  fetch("/stddelete", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: id }),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      //document.querySelector("#editstd" + id).style.display = "none";
      const aftrdelepg = 1;
      const aftrdellimit = page * 3;
      getdata(aftrdelepg, aftrdellimit);
    })
    .catch((error) => console.error("cant delete", error));
}

//load more button

document.getElementById("loadmore").addEventListener("click", () => {
  page += 1;
  getdata(page);
  console.log(page);
});
