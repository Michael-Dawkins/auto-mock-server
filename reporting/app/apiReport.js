apiReport = angular.module("apiReport", ["ngAnimate","ngMaterial","ngSanitize", "btford.markdown", "ui.bootstrap", "bootstrapLightbox"]);

apiReport.config(function (LightboxProvider) {
  LightboxProvider.getImageUrl = function (imageUrl) {
    return imageUrl;
  };
});