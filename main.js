function firstScript() {
  let targets = document.querySelectorAll("input[name='tag_checkbox']")
  for (let target of targets) {
    target.addEventListener("change",() => {
      makeList(target)
    });
  }
  generateOpList();
}

function generateOpList() {
  let csv = new XMLHttpRequest();
  csv.open("GET", "op_list.csv?date=202311232345",false);
  csv.send(null);
  if (csv.status != 200) {
    return;
  }
  let arr = [];
  let list = csv.responseText.split('\n');
  for (let i = 0; i < list.length; i++) {
    arr.push(list[i].split(','));
  }
  op_list = arr;
}

function resetCheckBox() {
  let targets = document.querySelectorAll("input[name='tag_checkbox']")
  for (let target of targets) {
    target.checked = false;
  }
  tag_list = [];
  makeList(targets[0]);
}

function rareCheckChange() {
  let target = document.querySelectorAll("input[name='tag_checkbox']")[0]
  makeList(target);
}

let tag_list = [];
function makeList(target) {
  let result_area = document.getElementById("result_area");
  let rare_check = document.getElementById("rare_check");
  result_area.innerHTML = ""
  check_boxes = document.getElementsByName("tag_checkbox");
  let check_count = tag_list.length;
  if (target.checked) {
    if (check_count >= 5) {
      target.checked = false;
    } else {
      if (!tag_list.includes(target.value)) {
        tag_list.push(target.value);
        check_count = tag_list.length;
      }
    }
  } else {
    tag_list = tag_list.filter(ele => ele != target.value);
    check_count = tag_list.length;
  }
  for (let bit = 1 ; bit < (1<<check_count); bit++) {
    let result_list = [...op_list];
    let ptn = [];
    for (let i = 0; i < check_count; i++) {
      if (bit & (1<<i)) {
        ptn.push(tag_list[i]);
        result_list = result_list.filter(ele => ele.includes(tag_list[i],1));
      }
    }
    if (ptn.length > 3) {
      continue
    }
    if (!ptn.includes("上級エリート")) {
      result_list = result_list.filter(ele => ele[2] != "6");
    }
    if (result_list.length != 0) {
      let name_list = [];
      let rare = 5;
      result_list.forEach(element => {
        name_list.push(element[1]);
        if (rare != 3 && (element[2] == 4 || element[2] == 1)) {
          rare = 4;
        } else if (element[2] == 3) {
          rare = 3;
        }
      });
      if (rare_check.checked && rare == 3) {
        continue;
      }
      let new_element = document.createElement("div");
      let new_title = document.createElement("h4");
      let new_content = document.createElement("p");
      new_title.textContent = ptn.join("+");
      if (rare == 5) {
        new_title.style.color = "red";
      } else if (rare == 4) {
        new_title.style.color = "blue";
      }
      new_content.textContent = name_list;
      new_element.appendChild(new_title);
      new_element.appendChild(new_content);
      if (rare == 5) {
        result_area.insertBefore(new_element,result_area.firstChild);
      } else {
        result_area.appendChild(new_element);
      }
    }
  }
}