Kemystry.Lab = Lab;
return Kemystry;
}(Kemystry || {}));
Kemystry.open();
document.addEventListener('DOMContentLoaded', Kemystry.setup);
if (typeof define === "function" && define.amd) {
    define("kemystry", [], function() {
        return Kemystry;
    });
}
if (typeof noGlobal == typeof undefined) {
    window.Kemystry = Kemystry;
}
return Kemystry;
});