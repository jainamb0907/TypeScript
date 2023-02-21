export{}

declare var url: any;
// declare var Swal: any;
// declare var fileInput: any;
// import Swal from sweetalert2@11;


//Validate form inputs before submitting data
function validateForm() {
  var pname = (document.getElementById("pname")as HTMLFormElement).value;
  var pid = (document.getElementById("pid")as HTMLFormElement).value;
  var pi = (document.getElementById("pi")as HTMLFormElement).value;
  var pd = (document.getElementById("pd")as HTMLFormElement).value;
  var pp = (document.getElementById("pp")as HTMLFormElement).value;

  if (pname == "" || pp == "" || pd == "") {
    alert("All fields are required!");
    return false;
  }

  if (isNaN(pid)) {
    alert("Only numeric Value");
    return false;
  }
  if (pp < 0) {
    alert("Price must be positive.");
    return false;
  }

  return true;
}

var inputBox= (document.getElementById("pp")as HTMLFormElement);

var invalidChars = ["-", "+", "E", "e"];

inputBox.addEventListener("keydown", function (e) {
  if (invalidChars.includes(e.key)) {
    e.preventDefault();
  }
});

//function to show data from local storage
function showData():any {
  var pid = (document.getElementById("pid")as HTMLFormElement).value;
  pid.disabled = false;
  var productlist;
  if (localStorage.getItem("productlist") == null) {
    productlist = [];
  } else {
    productlist = JSON.parse(localStorage.getItem("productlist")as string);
  }

  var html = "";
  productlist.forEach(function (element: { pname: string; pid: number; pi: any; pd: any; pp: number; }, index: any) {
    html += `<tr>
                <td> ${element.pname} </td>
                <td> ${element.pid} </td>
                <td> <img src= "${element.pi}" style='height:100px; width:100px;' alt='Product Image'></td>
                <td> ${element.pd} </td>
                <td> ${element.pp} &#8377; </td>
                <td> <button onclick="updateData(${index})" class="btn btn-warning m-2">Edit</button></td>
                <td> <button onclick='deleteData(${index})' class="btn btn-danger">Delete</button></td>
              </tr>`;
  });

  (document.querySelector("#CRUDTable tbody")as HTMLFormElement).innerHTML = html;
}

//Loads all data from local storage when document or page loaded
document.onload = showData();

// function to add data to local storage
function AddData() {
  //If form is validate
  if (validateForm() == true) {
    var pname = (document.getElementById("pname")as HTMLFormElement).value;
    var pid= (document.getElementById("pid")as HTMLFormElement).value;
    var pi = (document.getElementById("pi")as HTMLFormElement).files[0];
    var pd = (document.getElementById("pd")as HTMLFormElement).value;
    var pp = (document.getElementById("pp")as HTMLFormElement).value;

    let reader = new FileReader();
    reader.readAsDataURL(pi);
    reader.addEventListener("load", () => {
      var url = reader.result;
      var productlist;
      if (localStorage.getItem("productlist") == null) {
        productlist = [];
      } else {
        productlist = JSON.parse(localStorage.getItem("productlist")as string);
      }

      productlist.push({
        pname: pname,
        pid: pid,
        pi: url,
        pd: pd,
        pp: pp,
      });
      localStorage.setItem("productlist", JSON.stringify(productlist));
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Your file has been added",
        showConfirmButton: false,
        timer: 1500,
      });
      showData();
    });

    (document.getElementById("pname")as HTMLFormElement).value = "";
    (document.getElementById("pid")as HTMLFormElement).value = "";
    (document.getElementById("pi")as HTMLFormElement).value = "";
    (document.getElementById("pd")as HTMLFormElement).value = "";
    (document.getElementById("pp")as HTMLFormElement).value = "";
    (document.getElementById("imgedit")as HTMLFormElement).src = "";
  }
}

//function to delete data from local storage
function deleteData(index: any) {
  var productlist:any;
  if (localStorage.getItem("productlist") == null) {
    productlist = [];
  } else {
    productlist = JSON.parse(localStorage.getItem("productlist")as string);
  }
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  }).then((result: { isConfirmed: any; }) => {
    if (result.isConfirmed) {
      productlist.splice(index, 1);
      localStorage.setItem("productlist", JSON.stringify(productlist));
      showData();
      Swal.fire("Deleted!", "Your entry has been deleted.", "success");
    }
  });
}

//function to update data from local storage
function updateData(index: string | number) {
  //submit button will hide and update button will show for updating of data in local storage
  (document.getElementById("submit")as HTMLButtonElement).style.display = "none";
  (document.getElementById("update")as HTMLButtonElement).style.display = "block";
  let newimg = (document.getElementById("pi")as HTMLFormElement);

  var productlist:any;
  if (localStorage.getItem("productlist") == null) {
    productlist = [];
  } else {
    productlist = JSON.parse(localStorage.getItem("productlist")as string);
  }
  var pid = (document.getElementById("pid")as HTMLFormElement).value;
  pid.disabled = true;
  (document.getElementById("pname")as HTMLFormElement).value = productlist[index].pname;
  (document.getElementById("pid")as HTMLFormElement).value = productlist[index].pid;
  (document.getElementById("imgedit")as HTMLFormElement).src = productlist[index].pi;
  (document.getElementById("pd")as HTMLFormElement).value = productlist[index].pd;
  (document.getElementById("pp")as HTMLFormElement).value = productlist[index].pp;

  (document.querySelector("#update")as HTMLButtonElement).onclick = function () {
    if (newimg.value == "") {
      if (validateForm() == true) {
        (productlist[index].pname = document.getElementById("pname")as HTMLFormElement).value;
        (productlist[index].pd = document.getElementById("pd")as HTMLFormElement).value;
        (productlist[index].pp = document.getElementById("pp")as HTMLFormElement).value;

        localStorage.setItem("productlist", JSON.stringify(productlist));
        showData();

        (document.getElementById("pname")as HTMLFormElement).value = "";
        (document.getElementById("pid")as HTMLFormElement).value = "";
        (document.getElementById("pd")as HTMLFormElement).value = "";
        (document.getElementById("pi")as HTMLFormElement).value = "";
        (document.getElementById("pp")as HTMLFormElement).value = "";
        (document.getElementById("imgedit")as HTMLFormElement).src = "";
        Swal.fire("Congrats!", "You changes has been saved", "success");

        //update button will hide and submit button will show
        (document.getElementById("submit")as HTMLButtonElement).style.display = "block";
        (document.getElementById("update")as HTMLButtonElement).style.display = "none";
      }
    } else if (validateForm() == true) {
      let pi = newimg.files[0];
      let reader = new FileReader();
      reader.readAsDataURL(pi);

      reader.addEventListener("load", () => {

        url = reader.result;
        productlist[index].pname = (document.getElementById("pname")as HTMLFormElement).value;
        productlist[index].pi = url;
        productlist[index].pp = (document.getElementById("pp")as HTMLFormElement).value;
        productlist[index].pd = (document.getElementById("pd")as HTMLFormElement).value;

        localStorage.setItem("productlist", JSON.stringify(productlist));
        showData();

        (document.getElementById("pname")as HTMLFormElement).value = "";
        (document.getElementById("pid")as HTMLFormElement).value = "";
        (document.getElementById("pi")as HTMLFormElement).value = "";
        (document.getElementById("pd")as HTMLFormElement).value = "";
        (document.getElementById("pp")as HTMLFormElement).value = "";
        (document.getElementById("imgedit")as HTMLFormElement).src = "";
        Swal.fire("Congrats!", "You changes has been saved", "success");
      });

      //update button will hide and submit button will show
      (document.getElementById("submit")as HTMLButtonElement).style.display = "block";
      (document.getElementById("update")as HTMLButtonElement).style.display = "none";
    }
  };
}

//function to Sort and Filter data
function arrangeBy(x: any) {
  var productlist;
  if (localStorage.getItem("productlist") == null) {
    productlist = [];
  } else {
    productlist = JSON.parse(localStorage.getItem("productlist")as string);
  }

  switch (x) {
    case "lowest":
      productlist.sort((a: { pp: number; }, b: { pp: number; }) => {
        return a.pp - b.pp;
      });
      localStorage.setItem("productlist", JSON.stringify(productlist));
      showData();
      break;

    case "highest":
      productlist.sort((a: { pp: number; }, b: { pp: number; }) => {
        return b.pp - a.pp;
      });
      localStorage.setItem("productlist", JSON.stringify(productlist));
      showData();
      break;

    case "1ton":
      productlist.sort((a: { pid: number; }, b: { pid: number; }) => {
        return a.pid - b.pid;
      });
      localStorage.setItem("productlist", JSON.stringify(productlist));
      showData();
      break;

    case "atoz":
      productlist.sort(function (a: { pname: string; }, b: { pname: string; }) {
        var x = a.pname.toLowerCase();
        var y = b.pname.toLowerCase();
        return x < y ? -1 : x > y ? 1 : 0;
      });
      localStorage.setItem("productlist", JSON.stringify(productlist));
      showData();
      break;
  }
}

//Function to validate Image
function validateImage() {
  var pi = (document.getElementById("pi")as HTMLFormElement);
  var file = pi.value;
  var extensions = /(\.webp|\.jpg|\.jpeg|\.svg|\.png|\.gif)$/i;

  if (!extensions.exec(file)) {
    alert("Invalid file type");
    fileInput.value = "";
    return false;
  }
  return true;
}

//Function to display image
function readURL(input:any) {
  (document.getElementById("pi")as HTMLFormElement).src = "";
  if (input.files || input.files[0]) {
    var reader = new FileReader();
    reader.onload = function (e) {
      $("#imgedit").attr("src", e.target.result).width(100).height(100);
    };

    reader.readAsDataURL(input.files[0]);
  }
}

//Function to search by id in search bar
function searchById() {
  var input, filter, table, tr, td, i, txtValue, j;
  input = document.getElementById("search-input");
  filter = input.value;
  table = document.getElementById("CRUDTable");
  tr = (table as HTMLElement).getElementsByTagName("tr");
  for (i = 0; i < tr.length; i++) {
    for (j = 0; j <= i; j++) {
      td = tr[j].getElementsByTagName("td")[1];
      if (td) {
        txtValue = td.innerText;
        if (txtValue.indexOf(filter) > -1) {
          tr[j].style.display = "";
        } else {
          tr[j].style.display = "none";
        }
      }
    }
  }
}
