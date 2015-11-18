//inject angular file upload directives and service.
angular.module('molview', []).config(function ($sceProvider) {
  $sceProvider.enabled(false);
})
  .controller('MolViewAppCtrl', function ($scope, $http) {
    $scope.molecule = "";

    $scope.moleculeList = [
    ];

    $scope.addToMoleculeList = function () {
      if ($scope.molecule.trim() == "") return;

      $scope.moleculeList.push(
        {
          molecule: $scope.molecule,
          molFile: jsmeApplet.molFile(),
          molImage: btoa(jsmeApplet.getMolecularAreaGraphicsString())
        }
        );

      $scope.molecule = "";
      $scope.moleculeName = "";
      jsmeApplet.reset();
    };

    $scope.fetchMolecule = function () {
      var responsePromise = $http.get("http://cactus.nci.nih.gov/chemical/structure/" + $scope.molecule + "/sdf", {});
      responsePromise.success(function (dataFromServer, status, headers, config) {
        jsmeApplet.reset();
        jsmeApplet.readMolFile(dataFromServer);
        jsmeApplet.showInfo("Structure for: [" + $scope.molecule + "]")
      });
      responsePromise.error(function (data, status, headers, config) {
        jsmeApplet.reset();
        jsmeApplet.showInfo("Could not find structure for: [" + $scope.molecule + "]")
      });
    }
  });

var jsmeApplet = null;

function jsmeOnLoad() {
  if (jsmeApplet == null) {
    jsmeApplet = new JSApplet.JSME("JME", "350px", "330px");
  }

  if (jsmeApplet != null) {
    jsmeApplet.showInfo("");
  }
}

