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
      if (prefix === "opt2" || prefix === "opt3" || prefix === "opt4") {
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
    var schedule = document.getElementById("opt1-schedule");
    var electiveWrap = document.getElementById("opt1-electives");
    var feeWrap = document.getElementById("opt1-fees");
    var fullOut = document.getElementById("opt1-full-price");
    var discountOut = document.getElementById("opt1-discount-value");
    var saveOut = document.getElementById("opt1-save-value");
    var depositOut = document.getElementById("opt1-deposit");
    var monthlyOut = document.getElementById("opt1-monthly");
    var monthlyTotalOut = document.getElementById("opt1-monthly-total");

    if (!schedule) return;

    var baseTotal = 42680;
    var baseRegistration = 2080;
    var deposit = 4000;
    var paymentCount = 10;

    var render = function () {
      var electiveTotal = sumChecked(electiveWrap);
      var feeTotal = sumChecked(feeWrap);
      var selectedReg = document.querySelector("input[name='opt1-registration']:checked");
      var registrationFee = Number(selectedReg ? selectedReg.value : 2080);
      var total = baseTotal + electiveTotal + feeTotal + (registrationFee - baseRegistration);
      var discountValue = total * 0.08;
      var monthly = (total - deposit) / paymentCount;

      if (regValue) regValue.textContent = money(registrationFee);
      if (fullOut) fullOut.textContent = money(total);
      if (discountOut) discountOut.textContent = "-" + money(discountValue);
      if (saveOut) saveOut.textContent = money(discountValue);
      if (depositOut) depositOut.textContent = money(deposit);
      if (monthlyOut) monthlyOut.textContent = money(monthly);
      if (monthlyTotalOut) monthlyTotalOut.textContent = money(total);

      var rows = [];
      for (var i = 0; i < paymentCount; i += 1) {
        rows.push("<div class='schedule-item'><span>" + monthDateLabel(i) + "</span><strong>" + money(monthly) + "</strong></div>");
      }
      schedule.innerHTML = rows.join("");
    };

    if (electiveWrap) electiveWrap.addEventListener("change", render);
    if (feeWrap) feeWrap.addEventListener("change", render);
    document.querySelectorAll("input[name='opt1-registration']").forEach(function (el) {
      el.addEventListener("change", render);
    });
    render();
  })();

  // Option 2
  initCore("opt2", function (state) {
    var term = 8;
    var upfront = state.coreTotal;
    var planTotal = upfront;
    var monthly = planTotal / term;

    var upfrontOut = document.getElementById("opt2-upfront-price");
    var monthlyOut = document.getElementById("opt2-monthly");
    var durationOut = document.getElementById("opt2-duration-text");
    var planOut = document.getElementById("opt2-plan-total");
    var breakdownList = document.getElementById("opt2-breakdown-list");

    if (upfrontOut) upfrontOut.textContent = money(upfront);
    if (monthlyOut) monthlyOut.textContent = money(monthly);
    if (durationOut) durationOut.textContent = "8 months (4 per semester)";
    if (planOut) planOut.textContent = money(planTotal);

    if (breakdownList) {
      var rows = [];
      for (var i = 0; i < term; i += 1) {
        rows.push("<div class='schedule-item'><span>" + monthDateLabel(i) + "</span><strong>" + money(monthly) + "</strong></div>");
      }
      breakdownList.innerHTML = rows.join("");
    }
  });

  (function initOpt2Breakdown() {
    var toggle = document.getElementById("opt2-breakdown-toggle");
    var list = document.getElementById("opt2-breakdown-list");
    if (!toggle || !list) return;
    toggle.addEventListener("click", function () {
      var isOpen = !list.classList.contains("hidden");
      list.classList.toggle("hidden", isOpen);
      toggle.setAttribute("aria-expanded", isOpen ? "false" : "true");
      toggle.textContent = isOpen ? "View Breakdown" : "Hide Breakdown";
    });
  })();

  // Option 3
  (function initOption3() {
    var root = document.getElementById("opt3-core-root");
    if (!root) return;

    var COMPULSORY_TOTAL_OPT3 = 16620;
    var FIXED_ELECTIVE_TOTAL = 2 * 2770;
    var PAYMENT_COUNT = 8;
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

    var fees = document.getElementById("opt3-fees");
    var regValue = document.getElementById("opt3-registration-value");
    var upfrontOut = document.getElementById("opt3-upfront-amount");
    var monthlyOut = document.getElementById("opt3-monthly-amount");
    var monthlyBreakdown = document.getElementById("opt3-monthly-breakdown");
    var focusModulesOut = document.getElementById("opt3-focus-modules");

    var render = function () {
      var feeTotal = sumChecked(fees);
      var selectedReg = document.querySelector("input[name='opt3-registration']:checked");
      var registrationFee = Number(selectedReg ? selectedReg.value : 2080);
      var selectedFocus = document.querySelector("input[name='opt3-focus-area']:checked");
      var focusKey = selectedFocus ? selectedFocus.value : "";
      var electiveTotal = FIXED_ELECTIVE_TOTAL;
      var total = COMPULSORY_TOTAL_OPT3 + electiveTotal + feeTotal + registrationFee;
      var monthly = total / PAYMENT_COUNT;

      if (regValue) regValue.textContent = money(registrationFee);
      if (upfrontOut) upfrontOut.textContent = money(total);
      if (monthlyOut) monthlyOut.textContent = money(monthly);

      if (focusModulesOut) {
        if (!focusKey || !focusModules[focusKey]) {
          focusModulesOut.innerHTML = "<li>No focus area selected yet.</li>";
        } else {
          var modules = focusModules[focusKey];
          focusModulesOut.innerHTML = "<li>" + modules[0] + "</li><li>" + modules[1] + "</li>";
        }
      }

      if (monthlyBreakdown) {
        var rows = [];
        for (var i = 0; i < PAYMENT_COUNT; i += 1) {
          rows.push("<div class='schedule-item'><span>" + monthDateLabel(i) + "</span><strong>" + money(monthly) + "</strong></div>");
        }
        monthlyBreakdown.innerHTML = rows.join("");
      }
    };

    if (fees) fees.addEventListener("change", render);
    document.querySelectorAll("input[name='opt3-registration']").forEach(function (el) {
      el.addEventListener("change", render);
    });
    document.querySelectorAll("input[name='opt3-focus-area']").forEach(function (el) {
      el.addEventListener("change", render);
    });

    render();
  })();

  // Option 4
  initCore("opt4", function (state) {
    var payment = document.querySelector("input[name='opt4-payment']:checked");
    var mode = payment ? payment.value : "monthly";
    var monthlyAmount = state.coreTotal / 10;
    var upfrontAmount = state.coreTotal * 0.92;

    var monthlyOut = document.getElementById("opt4-monthly-view");
    var upfrontOut = document.getElementById("opt4-upfront-view");
    var coreOut = document.getElementById("opt4-core-total");

    if (monthlyOut) monthlyOut.textContent = money(monthlyAmount);
    if (upfrontOut) upfrontOut.textContent = money(upfrontAmount);
    if (coreOut) coreOut.textContent = money(mode === "upfront" ? upfrontAmount : state.coreTotal);
  });

  document.querySelectorAll("input[name='opt4-payment']").forEach(function (el) {
    el.addEventListener("change", function () {
      var evt = new Event("change", { bubbles: true });
      var reg = document.querySelector("input[name='opt4-registration']:checked");
      if (reg) reg.dispatchEvent(evt);
    });
  });
})();
