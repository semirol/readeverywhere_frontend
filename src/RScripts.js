function myAlert(str){
    let element = document.getElementById("RAlertInfo");
    element.innerText=str;
    element.setAttribute("isdisplay","true");
    setTimeout(()=>element.setAttribute("isdisplay","false"),5000);
}

export {myAlert};
