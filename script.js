function upload() {
    //Reference the FileUpload element.
    const fileUpload = document.getElementById("file-upload");

    //Validate whether File is valid Excel file.
    const regex = /^([a-zA-Z0-9\s_\\.\-:])+(.xls|.xlsx)$/;
    if (regex.test(fileUpload.value.toLowerCase())) {
        if (typeof (FileReader) != "undefined") {
            const reader = new FileReader();

            //For Browsers other than IE.
            if (reader.readAsBinaryString) {
                reader.onload = function (e) {
                    processExcel(e.target.result);
                };
                reader.readAsBinaryString(fileUpload.files[0]);
            } else {
                //For IE Browser.
                reader.onload = function (e) {
                    const data = "";
                    const bytes = new Uint8Array(e.target.result);
                    for (let i = 0; i < bytes.byteLength; i++) {
                        data += String.fromCharCode(bytes[i]);
                    }
                    processExcel(data);
                };
                reader.readAsArrayBuffer(fileUpload.files[0]);
            }
        } else {
            alert("This browser does not support HTML5.");
        }
    } else {
        alert("Please upload a valid Excel file.");
    }
    displaySection();
};
function processExcel(data) {
    //Read the Excel File data.
    const workbook = XLSX.read(data, {
        type: 'binary'
    });

    //Fetch the name of First Sheet.
    const firstSheet = workbook.SheetNames[0];

    //Read all rows from First Sheet into an JSON array.
    const excelRows = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[firstSheet]);
    console.log('header check', checkHeader(excelRows))
    if(!checkHeader(excelRows)){
        alert("please upload excel file that matches the headers")
        return;
    }

    //Create a HTML Table element.
    const table = document.createElement("table");
    table.border = "0";

    //Add the header row.
    let row = table.insertRow(-1);

    //Add the header cells.
    let headerCell = document.createElement("th");
    headerCell.innerHTML = "Fullname";
    row.appendChild(headerCell);

    headerCell = document.createElement("th");
    headerCell.innerHTML = "Phone Number";
    row.appendChild(headerCell);

    headerCell = document.createElement("th");
    headerCell.innerHTML = "Address";
    row.appendChild(headerCell);

    headerCell = document.createElement("th");
    headerCell.innerHTML = "State";
    row.appendChild(headerCell);

    headerCell = document.createElement("th");
    headerCell.innerHTML = "LGA";
    row.appendChild(headerCell);

    headerCell = document.createElement("th");
    headerCell.innerHTML = "Date of Birth";
    row.appendChild(headerCell);

    headerCell = document.createElement("th");
    headerCell.innerHTML = "Salary";
    row.appendChild(headerCell);

    headerCell = document.createElement("th");
    headerCell.innerHTML = "Gender";
    row.appendChild(headerCell);

    headerCell = document.createElement("th");
    headerCell.innerHTML = "Call Allowance";
    row.appendChild(headerCell);

    headerCell = document.createElement("th");
    headerCell.innerHTML = "Transport Allowance";
    row.appendChild(headerCell);

    //Add the data rows from Excel file.
    for (let i = 0; i < excelRows.length; i++) {
        //Add the data row.
        let row = table.insertRow(-1);

        //Add the data cells.
        let cell = row.insertCell(-1);
        cell.innerHTML = excelRows[i].Fullname;

        cell = row.insertCell(-1);
        cell.innerHTML = excelRows[i]["Phone Number"];

        cell = row.insertCell(-1);
        cell.innerHTML = excelRows[i].Address;

        cell = row.insertCell(-1);
        cell.innerHTML = excelRows[i].State;

        cell = row.insertCell(-1);
        cell.innerHTML = excelRows[i].LGA;

        cell = row.insertCell(-1);
        cell.innerHTML = excelRows[i]["Date of Birth"];

        cell = row.insertCell(-1);
        cell.innerHTML = excelRows[i].Salary;

        cell = row.insertCell(-1);
        cell.innerHTML = excelRows[i].Gender;

        cell = row.insertCell(-1);
        cell.innerHTML = excelRows[i]["Call Allowance"];

        cell = row.insertCell(-1);
        cell.innerHTML = excelRows[i]["Transport Allowance"];
    }

    const dvExcel = document.getElementById("Excel-div");
    dvExcel.innerHTML = "";
    dvExcel.appendChild(table);
};

function checkHeader (data){
    let check = false;
    for (let head of data){
        if(head["Address"] !== undefined && 
        head["Call Allowance"] !== undefined && 
        head["Date of Birth"] !== undefined  && 
        head["Transport Allowance"] !== undefined  &&
         head["Gender"] !== undefined  && 
         head["State"] !== undefined &&
         head["Fullname"] !== undefined &&
         head["Phone Number"] !== undefined &&
         head["Salary"] !== undefined &&
          head["LGA"] !== undefined){
            check = true
        } else {
            return false;
        }
    }
    return check;
}

function displaySection() {
    const firstSection = document.getElementById("section-1");
    const secondSection = document.getElementById("section-2");

    if (secondSection.style.display === "none") {
         secondSection.style.display = "block";
        firstSection.style.display= "none";
    } else {
        secondSection.style.display = "none";
        firstSection.style.display = "block";
    }
}

function save() {
    const fileUpload = document.getElementById("file-upload");
    const value = fileUpload.files[0];
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState == XMLHttpRequest.DONE) {
            console.log('Response: ', xhr.responseText)
            alert("file saved");  
        }
    }
    xhr.open("POST", "https://httpbin.org/anything", true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({
       value: value
    }));
}