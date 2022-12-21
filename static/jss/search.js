let search_terms = [];
window.onload = function () {
  divs = document.getElementsByClassName("post-stub-title");
  for(i = 0; i < divs.length;i++) {
    search_terms.push(divs[i].innerText);
  }
  autocomplete(document.getElementById("searchItem"), search_terms);
};

function autocompleteMatch(input) {
  if (input == "" || input.length <= 1) {
    return [];
  }
  var reg = new RegExp(input,'i');
  return search_terms.filter(function (term) {
    if (term.match(reg)) {
      return term;
    }
  });
}
function search() {
  var name = document.getElementById("searchForm").elements["searchItem"].value;
  var pattern = name.toLowerCase();
  var targetId = "";

//   var divs = document.getElementsByClassName("post-stub-title");
  for (var i = 0; i < search_terms.length; i++) {
    var title = search_terms[i];
    var titleLower = title.toLowerCase();
    var index = titleLower.indexOf(pattern);
    if (index != -1) {
    //   targetId = divs[i].parentNode.parentNode.parentNode.id;
      document.getElementById(title).scrollIntoView();
      break;
    }
  }
}
function autocomplete(inp, arr) {
    /*the autocomplete function takes two arguments,
    the text field element and an array of possible autocompleted values:*/
    var currentFocus;
    /*execute a function when someone writes in the text field:*/
    inp.addEventListener("input", function(e) {
        var a, b, i, val = this.value;
        /*close any already open lists of autocompleted values*/
        closeAllLists();
        if (!val) { return false;}
        currentFocus = -1;
        /*create a DIV element that will contain the items (values):*/
        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");
        /*append the DIV element as a child of the autocomplete container:*/
        this.parentNode.appendChild(a);
        // get a list of matches
        let matches = autocompleteMatch(val);
        /*for each item in the array...*/
        for (i = 0; i < matches.length; i++) {
            /*create a DIV element for each matching element:*/
            b = document.createElement("DIV");
            /*make the matching letters bold:*/
            let match = matches[i];
            let matchLower = match.toLowerCase();
            var indexOfMatch = matchLower.indexOf(val.toLowerCase());
            b.innerHTML = match.substr(0,indexOfMatch);
            b.innerHTML += "<span class=autocomplete-match>" + match.substr(indexOfMatch, val.length) + "</span>";
            b.innerHTML += match.substr(indexOfMatch+val.length,match.length);
            // b.innerHTML += match;
            /*insert a input field that will hold the current array item's value:*/
            b.innerHTML += "<input type='hidden' value='" + match + "'>";
            /*execute a function when someone clicks on the item value (DIV element):*/
            b.addEventListener("click", function(e) {
                /*insert the value for the autocomplete text field:*/
                inp.value = this.getElementsByTagName("input")[0].value;
                /*close the list of autocompleted values,
                (or any other open lists of autocompleted values:*/
                closeAllLists();
                search();
            });
            a.appendChild(b);
        }
    });
    /*execute a function presses a key on the keyboard:*/
    inp.addEventListener("keydown", function(e) {
        var x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {
          /*If the arrow DOWN key is pressed,
          increase the currentFocus variable:*/
          currentFocus++;
          /*and and make the current item more visible:*/
          addActive(x);
        } else if (e.keyCode == 38) { //up
          /*If the arrow UP key is pressed,
          decrease the currentFocus variable:*/
          currentFocus--;
          /*and and make the current item more visible:*/
          addActive(x);
        } else if (e.keyCode == 13) {
          /*If the ENTER key is pressed, prevent the form from being submitted,*/
          e.preventDefault();
          if (currentFocus > -1) {
            /*and simulate a click on the "active" item:*/
            if (x) x[currentFocus].click();
          }
        }
    });
    function addActive(x) {
      /*a function to classify an item as "active":*/
      if (!x) return false;
      /*start by removing the "active" class on all items:*/
      removeActive(x);
      if (currentFocus >= x.length) currentFocus = 0;
      if (currentFocus < 0) currentFocus = (x.length - 1);
      /*add class "autocomplete-active":*/
      x[currentFocus].classList.add("autocomplete-active");
    }
    function removeActive(x) {
      /*a function to remove the "active" class from all autocomplete items:*/
      for (var i = 0; i < x.length; i++) {
        x[i].classList.remove("autocomplete-active");
      }
    }
    function closeAllLists(elmnt) {
      /*close all autocomplete lists in the document,
      except the one passed as an argument:*/
      var x = document.getElementsByClassName("autocomplete-items");
      for (var i = 0; i < x.length; i++) {
        if (elmnt != x[i] && elmnt != inp) {
          x[i].parentNode.removeChild(x[i]);
        }
      }
    }
    /*execute a function when someone clicks in the document:*/
    document.addEventListener("click", function (e) {
        closeAllLists(e.target);
    });
  }