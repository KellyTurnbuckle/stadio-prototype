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
      var coreTotal = COMPULSORY_TOTAL + electiveTotal + feeTotal + registrationFee;

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

  // Option 1
  initCore("opt1", function (state) {
    var term = Number((document.getElementById("opt1-term") || {}).value || 10);
    var mpm = Number((document.getElementById("opt1-mpm") || {}).value || 1);
    var mps = Number((document.getElementById("opt1-mps") || {}).value || 3);

    var full = state.coreTotal;
    var discount = full * 0.08;
    var upfront = full - discount;

    var loadFactor = ((mpm / 1) + (mps / 3)) / 2;
    var monthlyPlanTotal = full * loadFactor;
    var deposit = Math.min(monthlyPlanTotal * 0.35, 4000 * mpm);
    var monthly = (monthlyPlanTotal - deposit) / term;

    var fullOut = document.getElementById("opt1-full-price");
    var discountOut = document.getElementById("opt1-discount-value");
    var upfrontOut = document.getElementById("opt1-upfront-price");
    var saveOut = document.getElementById("opt1-save-value");
    var depositOut = document.getElementById("opt1-deposit");
    var monthlyOut = document.getElementById("opt1-monthly");
    var termOut = document.getElementById("opt1-term-text");
    var schedule = document.getElementById("opt1-schedule");

    if (fullOut) fullOut.textContent = money(full);
    if (discountOut) discountOut.textContent = "-" + money(discount);
    if (upfrontOut) upfrontOut.textContent = money(upfront);
    if (saveOut) saveOut.textContent = money(discount);
    if (depositOut) depositOut.textContent = money(deposit);
    if (monthlyOut) monthlyOut.textContent = money(monthly);
    if (termOut) termOut.textContent = String(term);

    if (schedule) {
      var lines = [];
      for (var i = 1; i <= term; i += 1) {
        lines.push("<div class='schedule-item'><span>Month " + i + "</span><strong>" + money(monthly) + "</strong></div>");
      }
      schedule.innerHTML = lines.join("");
    }
  });

  ["opt1-term", "opt1-mpm", "opt1-mps"].forEach(function (id) {
    var el = document.getElementById(id);
    if (el) {
      el.addEventListener("change", function () {
        var evt = new Event("change", { bubbles: true });
        var reg = document.querySelector("input[name='opt1-registration']:checked");
        if (reg) reg.dispatchEvent(evt);
      });
    }
  });

  // Option 2
  initCore("opt2", function (state) {
    var term = Number((document.getElementById("opt2-term") || {}).value || 12);
    var mpm = Number((document.getElementById("opt2-mpm") || {}).value || 1);
    var mps = Number((document.getElementById("opt2-mps") || {}).value || 3);

    var upfront = state.coreTotal;
    var loadFactor = ((mpm / 1) + (mps / 3)) / 2;
    var planTotal = upfront * loadFactor;
    var monthly = planTotal / term;

    var upfrontOut = document.getElementById("opt2-upfront-price");
    var monthlyOut = document.getElementById("opt2-monthly");
    var durationOut = document.getElementById("opt2-duration-text");
    var planOut = document.getElementById("opt2-plan-total");

    if (upfrontOut) upfrontOut.textContent = money(upfront);
    if (monthlyOut) monthlyOut.textContent = money(monthly);
    if (durationOut) durationOut.textContent = term + " months";
    if (planOut) planOut.textContent = money(planTotal);
  });

  ["opt2-term", "opt2-mpm", "opt2-mps"].forEach(function (id) {
    var el = document.getElementById(id);
    if (el) {
      el.addEventListener("change", function () {
        var evt = new Event("change", { bubbles: true });
        var reg = document.querySelector("input[name='opt2-registration']:checked");
        if (reg) reg.dispatchEvent(evt);
      });
    }
  });

  // Option 3
  initCore("opt3", function (state) {
    var upfrontOut = document.getElementById("opt3-upfront-amount");
    var monthlyOut = document.getElementById("opt3-monthly-amount");
    if (upfrontOut) upfrontOut.textContent = money(state.coreTotal);
    if (monthlyOut) monthlyOut.textContent = money(state.coreTotal / 10);
  });

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
