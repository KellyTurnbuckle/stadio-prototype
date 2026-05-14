(function () {
  function money(value) {
    return new Intl.NumberFormat("en-ZA", {
      style: "currency",
      currency: "ZAR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })
      .format(value)
      .replace("ZAR", "R")
      .replace(/\s/g, " ");
  }

  var COMPULSORY_TOTAL = 4 * 2770;
  var OPTION1_BASE_TOTAL = 42680;
  var OPTION1_BASE_REGISTRATION = 2080;

  function sumChecked(container) {
    if (!container) return 0;
    var total = 0;
    container.querySelectorAll("input[type='checkbox']").forEach(function (el) {
      if (el.checked) {
        total += Number(el.getAttribute("data-price")) || 0;
      }
    });
    return total;
  }

  function setupAccordionAndTabs() {
    document.querySelectorAll("[data-acc]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var targetId = btn.getAttribute("data-acc");
        var panel = document.getElementById(targetId);
        var group = btn.getAttribute("data-acc-group");
        if (group) {
          document.querySelectorAll("[data-acc-group='" + group + "']").forEach(function (otherBtn) {
            var otherTargetId = otherBtn.getAttribute("data-acc");
            var otherPanel = document.getElementById(otherTargetId);
            if (otherPanel && otherPanel !== panel) {
              otherPanel.classList.remove("open");
            }
          });
        }
        if (panel) panel.classList.toggle("open");
      });
    });

    var tabs = document.querySelectorAll("[data-tab]");
    if (tabs.length) {
      tabs.forEach(function (tabBtn) {
        tabBtn.addEventListener("click", function () {
          tabs.forEach(function (x) {
            x.classList.remove("active");
          });
          tabBtn.classList.add("active");
          var target = tabBtn.getAttribute("data-tab");
          var upfront = document.getElementById("tab-upfront");
          var monthly = document.getElementById("tab-monthly");
          if (upfront && monthly) {
            upfront.classList.toggle("hidden", target !== "upfront");
            monthly.classList.toggle("hidden", target !== "monthly");
          }
        });
      });
    }
  }

  function monthDateLabel(index) {
    var months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
    ];
    var startMonth = 1; // February
    var m = (startMonth + index) % 12;
    return "1 " + months[m];
  }

  function initCore(prefix, onRender) {
    var root = document.getElementById(prefix + "-core-root");
    if (!root) return;

    var electives = document.getElementById(prefix + "-electives");
    var fees = document.getElementById(prefix + "-fees");
    var regValue = document.getElementById(prefix + "-registration-value");
    var coreTotalOut = document.getElementById(prefix + "-core-total");

    var render = function () {
      var electiveTotal = sumChecked(electives);
      var feeTotal = sumChecked(fees);
      var selectedReg = document.querySelector("input[name='" + prefix + "-registration']:checked");
      var registrationFee = Number(selectedReg ? selectedReg.value : 2080);
      var coreTotal;
      if (prefix === "opt2" || prefix === "opt3") {
        coreTotal = OPTION1_BASE_TOTAL + electiveTotal + feeTotal + (registrationFee - OPTION1_BASE_REGISTRATION);
      } else {
        coreTotal = COMPULSORY_TOTAL + electiveTotal + feeTotal + registrationFee;
      }

      if (regValue) regValue.textContent = money(registrationFee);
      if (coreTotalOut) coreTotalOut.textContent = money(coreTotal);

      if (typeof onRender === "function") {
        onRender({
          coreTotal: coreTotal,
          electiveTotal: electiveTotal,
          feeTotal: feeTotal,
          registrationFee: registrationFee
        });
      }
    };

    if (electives) electives.addEventListener("change", render);
    if (fees) fees.addEventListener("change", render);
    document.querySelectorAll("input[name='" + prefix + "-registration']").forEach(function (el) {
      el.addEventListener("change", render);
    });

    render();
  }

  setupAccordionAndTabs();

  // Option 1 (final fixed example values)
  (function initOption1Final() {
    var regValue = document.getElementById("opt1-registration-value");
    var compulsoryTotalOut = document.getElementById("opt1-compulsory-total");
    var electiveTotalOut = document.getElementById("opt1-elective-total");
    var feeTotalOut = document.getElementById("opt1-fee-total");
    var schedule = document.getElementById("opt1-schedule");
    var electiveWrap = document.getElementById("opt1-electives");
    var feeWrap = document.getElementById("opt1-fees");
    var fullOut = document.getElementById("opt1-full-price");
    var saveOut = document.getElementById("opt1-save-value");
    var depositOut = document.getElementById("opt1-deposit");
    var monthlyOut = document.getElementById("opt1-monthly");
    var monthlyTotalOut = document.getElementById("opt1-monthly-total");

    if (!schedule) return;

    var baseTotal = 43260;
    var baseRegistration = 2080;
    var deposit = 4000;
    var paymentCount = 10;
    var compulsoryTotal = 5 * 6540;

    var render = function () {
      var electiveTotal = sumChecked(electiveWrap);
      var feeTotal = sumChecked(feeWrap);
      var total = baseTotal + electiveTotal + feeTotal;
      var discountValue = 4000;
      var upfrontTotal = total - discountValue;
      var monthly = (total - deposit) / paymentCount;

      if (compulsoryTotalOut) compulsoryTotalOut.textContent = money(compulsoryTotal);
      if (electiveTotalOut) electiveTotalOut.textContent = money(electiveTotal);
      if (feeTotalOut) feeTotalOut.textContent = money(feeTotal);
      if (fullOut) fullOut.textContent = money(upfrontTotal);
      if (saveOut) saveOut.textContent = money(discountValue);
      if (depositOut) depositOut.textContent = money(deposit);
      if (monthlyOut) monthlyOut.textContent = money(monthly);
      if (monthlyTotalOut) monthlyTotalOut.textContent = money(total);

      var rows = [];
      for (var i = 0; i < paymentCount; i += 1) {
        rows.push("<div class='schedule-item'><span>" + monthDateLabel(i) + " 2026</span><strong>" + money(monthly) + "</strong></div>");
      }
      schedule.innerHTML = rows.join("");
    };

    if (electiveWrap) electiveWrap.addEventListener("change", render);
    if (feeWrap) feeWrap.addEventListener("change", render);
    render();
  })();

  // Option 2
  (function initOption2() {
    var root = document.getElementById("opt2-core-root");
    if (!root) return;

    var COMPULSORY_TOTAL = 4 * 2770;
    var ELECTIVE_TOTAL = 2 * 2770;
    var PAYMENT_COUNT = 8;

    var focusMap = {
      accountancy: ["Accountancy for Managers 1", "Income Tax 1"],
      "aviation-management": ["Aviation Operations 1", "Aviation Safety Management 1"],
      cybersecurity: ["Cybersecurity Fundamentals 1", "Cyber Risk Management 1"],
      "data-management": ["Data Management Fundamentals 1", "Applied Data Practices 1"],
      "disaster-risk-management": ["Disaster Risk Reduction 1", "Project Management 1"],
      entrepreneurship: ["Entrepreneurial Planning 1", "Small Business Operations 1"],
      "fleet-management": ["Fleet Operations 1", "Fleet Cost Management 1"],
      "fire-technology-management": ["Fire Dynamics 1", "Fire Safety Systems 1"],
      "human-resources-management": ["Human Resource Management 1", "Labour Relations 1"]
    };

    var feeWrap = document.getElementById("opt2-fees");
    var compulsoryTotalOut = document.getElementById("opt2-compulsory-total");
    var feeTotalOut = document.getElementById("opt2-fee-total");
    var focusSelect = document.getElementById("opt2-focus-select");
    var focusDisplay = document.getElementById("opt2-focus-display");
    var electiveOne = document.getElementById("opt2-elective-1-name");
    var electiveTwo = document.getElementById("opt2-elective-2-name");
    var regValue = document.getElementById("opt2-registration-value");

    var upfrontOut = document.getElementById("opt2-upfront-price");
    var monthlyOut = document.getElementById("opt2-monthly");
    var planOut = document.getElementById("opt2-plan-total");
    var durationOut = document.getElementById("opt2-duration-text");
    var breakdownList = document.getElementById("opt2-breakdown-list");

    var render = function () {
      var selectedFocus = focusSelect ? focusSelect.value : "";
      var mapped = focusMap[selectedFocus];
      if (electiveOne) electiveOne.textContent = mapped ? mapped[0] : "Elective 1";
      if (electiveTwo) electiveTwo.textContent = mapped ? mapped[1] : "Elective 2";
      if (focusDisplay) {
        focusDisplay.textContent = "Selected Focus Area";
      }

      var feeTotal = sumChecked(feeWrap);
      var planTotal = COMPULSORY_TOTAL + ELECTIVE_TOTAL + feeTotal;
      var monthly = planTotal / PAYMENT_COUNT;
      var semesterOneTotal = monthly * 4;

      if (compulsoryTotalOut) compulsoryTotalOut.textContent = money(COMPULSORY_TOTAL);
      if (feeTotalOut) feeTotalOut.textContent = money(feeTotal);
      if (upfrontOut) upfrontOut.textContent = money(planTotal);
      if (monthlyOut) monthlyOut.textContent = money(monthly);
      if (durationOut) durationOut.textContent = "8 payments (4 per semester)";
      if (planOut) planOut.textContent = money(semesterOneTotal);

      if (breakdownList) {
        var rows = [];
        rows.push("<div class='semester-divider'>Semester 2</div>");
        var months = ["1 August 2026", "1 September 2026", "1 October 2026", "1 November 2026"];
        months.forEach(function (m) {
          rows.push("<div class='schedule-item'><span>" + m + "</span><strong>" + money(monthly) + "</strong></div>");
        });
        breakdownList.innerHTML = rows.join("");
      }
    };

    if (feeWrap) feeWrap.addEventListener("change", render);
    if (focusSelect) focusSelect.addEventListener("change", render);
    render();
  })();

  (function initOpt2Breakdown() {
    var toggle = document.getElementById("opt2-breakdown-toggle");
    var list = document.getElementById("opt2-breakdown-list");
    var totalRow = document.getElementById("opt2-plan-total-row");
    if (toggle && list) {
      toggle.textContent = "View payment plan";
      toggle.addEventListener("click", function () {
        var isOpen = !list.classList.contains("hidden");
        list.classList.toggle("hidden", isOpen);
        if (totalRow) totalRow.classList.toggle("hidden", isOpen);
        toggle.setAttribute("aria-expanded", isOpen ? "false" : "true");
        toggle.textContent = isOpen ? "View payment plan" : "Hide payment plan";
      });
    }
  })();

  // Option 3
  (function initOption3() {
    var root = document.getElementById("opt3-core-root");
    if (!root) return;

    var COMPULSORY_TOTAL_OPT3 = 4 * 2770;
    var FIXED_ELECTIVE_TOTAL = 2 * 2770;
    var SEMESTER_BASE_TOTAL = 8310;
    var focusModules = {
      accountancy: ["Accountancy for Managers 1", "Income Tax 1"],
      "aviation-management": ["Aviation Operations 1", "Aviation Safety Management 1"],
      cybersecurity: ["Cybersecurity Fundamentals 1", "Cyber Risk Management 1"],
      "data-management": ["Data Management Fundamentals 1", "Applied Data Practices 1"],
      "disaster-risk-management": ["Disaster Risk Reduction 1", "Project Management 1"],
      entrepreneurship: ["Entrepreneurial Planning 1", "Small Business Operations 1"],
      "fleet-management": ["Fleet Operations 1", "Fleet Cost Management 1"],
      "fire-technology-management": ["Fire Dynamics 1", "Fire Safety Systems 1"],
      "human-resources-management": ["Human Resource Management 1", "Labour Relations 1"]
    };

    var focusCollapsedCopy = document.getElementById("opt3-focus-collapsed-copy");
    var addRegistrationInputs = document.querySelectorAll("input[name='opt3-add-registration']");
    var studyStartValue = document.getElementById("opt3-study-start-value");
    var studyStartButtons = document.querySelectorAll(".opt3-start-btn");
    var focusSelect = document.getElementById("opt3-focus-select");
    var focusDisplay = document.getElementById("opt3-focus-display");
    var electiveOne = document.getElementById("opt3-elective-1-name");
    var electiveTwo = document.getElementById("opt3-elective-2-name");
    var upfrontOut = document.getElementById("opt3-upfront-amount");
    var monthlyOut = document.getElementById("opt3-monthly-amount");
    var monthlyBreakdown = document.getElementById("opt3-monthly-breakdown");

    var render = function () {
      var selectedFocus = focusSelect ? focusSelect.value : "";
      var mapped = focusModules[selectedFocus];
      if (electiveOne) electiveOne.textContent = mapped ? mapped[0] : "Elective 1";
      if (electiveTwo) electiveTwo.textContent = mapped ? mapped[1] : "Elective 2";
      if (focusDisplay) focusDisplay.textContent = "Select focus area";
      if (focusCollapsedCopy) {
        focusCollapsedCopy.textContent = selectedFocus
          ? focusSelect.options[focusSelect.selectedIndex].text
          : "Choose a focus area to personalise your course estimate.";
      }

      var feeTotal = 0;
      var electiveTotal = FIXED_ELECTIVE_TOTAL;
      var total = COMPULSORY_TOTAL_OPT3 + electiveTotal + feeTotal;
      var includeRegistration = document.querySelector("input[name='opt3-add-registration']:checked");
      var addRegistration = includeRegistration && includeRegistration.value === "yes";
      var selectedStart = studyStartValue ? studyStartValue.value : "sem2-2026";
      var isSemester2 = selectedStart === "sem2-2026";
      var semesterTotal = SEMESTER_BASE_TOTAL + feeTotal + (addRegistration ? 2080 : 0);
      var monthly = semesterTotal / 4;

      if (upfrontOut) upfrontOut.textContent = money(total);
      if (monthlyOut) monthlyOut.textContent = money(monthly);

      if (monthlyBreakdown) {
        var rows = [];
        rows.push("<div class='semester-divider'>" + (isSemester2 ? "Semester 2" : "Semester 1") + "</div>");
        rows.push("<div class='small opt3-semester-note'>These fees are based on starting in 2026.</div>");
        var months = isSemester2
          ? ["1 August 2026", "1 September 2026", "1 October 2026", "1 November 2026"]
          : ["1 February 2027", "1 March 2027", "1 April 2027", "1 May 2027"];
        months.forEach(function (m1) {
          rows.push("<div class='schedule-item'><span>" + m1 + "</span><strong class='opt3-schedule-amount'>" + money(monthly) + "</strong></div>");
        });
        rows.push("<div class='small opt3-full-plan-copy'>View full payment plan for the complete course.</div>");
        rows.push("<div class='schedule-item opt3-semester-total'><span>Total</span><strong>" + money(semesterTotal) + "</strong></div>");
        monthlyBreakdown.innerHTML = rows.join("");
      }
    };

    if (focusSelect) focusSelect.addEventListener("change", render);
    addRegistrationInputs.forEach(function (el) {
      el.addEventListener("change", render);
    });
    studyStartButtons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var start = btn.getAttribute("data-start");
        if (studyStartValue) {
          studyStartValue.value = start;
        }
        studyStartButtons.forEach(function (other) {
          other.classList.toggle("active", other === btn);
        });
        render();
      });
    });

    render();
  })();

  (function initOpt3Breakdown() {
    var toggle = document.getElementById("opt3-breakdown-toggle");
    var list = document.getElementById("opt3-monthly-breakdown");
    var studyStart = document.getElementById("opt3-study-start");
    var registrationOptions = document.getElementById("opt3-breakdown-options");
    var registrationDivider = document.querySelector("#opt3-registration-card .opt3-registration-divider");
    var monthlyTab = document.getElementById("tab-monthly");
    var upfrontTab = document.getElementById("tab-upfront");
    var tabButtons = document.querySelectorAll(".opt3-payment-block [data-tab]");
    var syncRegistrationVisibility = function () {
      if (!registrationOptions) return;
      var monthlyVisible = monthlyTab && !monthlyTab.classList.contains("hidden");
      registrationOptions.classList.toggle("hidden", !monthlyVisible);
      if (registrationDivider) registrationDivider.classList.toggle("hidden", !monthlyVisible);
    };
    if (toggle && list) {
      list.classList.add("hidden");
      if (studyStart) studyStart.classList.add("hidden");
      toggle.setAttribute("aria-expanded", "false");
      toggle.textContent = "View payment plan";
      toggle.addEventListener("click", function () {
        var isOpen = !list.classList.contains("hidden");
        list.classList.toggle("hidden", isOpen);
        if (studyStart) studyStart.classList.toggle("hidden", isOpen);
        toggle.setAttribute("aria-expanded", isOpen ? "false" : "true");
        toggle.textContent = isOpen ? "View payment plan" : "Hide payment plan";
      });
    }
    tabButtons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        if (upfrontTab && !upfrontTab.classList.contains("hidden")) {
          if (list) list.classList.add("hidden");
          if (studyStart) studyStart.classList.add("hidden");
          if (toggle) {
            toggle.setAttribute("aria-expanded", "false");
            toggle.textContent = "View payment plan";
          }
        }
        syncRegistrationVisibility();
      });
    });
    syncRegistrationVisibility();
  })();

})();
