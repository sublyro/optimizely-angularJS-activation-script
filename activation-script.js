// ANGULAR
(function() {
  'use strict';
  
  // wait until angular is ready
	var interval = setInterval(function () {
  	if (window.angular !== undefined && window.angular.element(document.getElementsByTagName('body')).scope() !== undefined) {
      console.log("angular is ready");
    	clearInterval(interval);
      var scope = window.angular.element(document.getElementsByTagName('body')).scope();
      // listen on new page loaded
      scope.$on('$viewContentLoaded', function () {
      	var page = document.URL;
        console.log("$viewContentLoaded with page " + page);
        var activated = false;
        // look for  manual experiments 
        for (var id in optimizely.allExperiments) {
        	var experiment = optimizely.allExperiments[id];
          if (experiment.enabled === true && experiment.activation_mode == 'manual') {
          	// check the URL targeting and activate as necessary
            for (var i = 0; i < experiment.urls.length; i++) {
            	var pageURL = experiment.urls[i];
              if (pageURL.match == 'simple' && simpleMatch(page, pageURL.value)) {
              	activated = true;
                window.optimizely.push(["activate", id]);
                break;
              } else if (pageURL.match == 'substring' && substringMatch(page, pageURL.value)) {
                activated = true;
                window.optimizely.push(["activate", id]);
                break;
              } else if (pageURL.match == 'exact' && exactMatch(page, pageURL.value)) {
              	activated = true;
                window.optimizely.push(["activate", id]);
                break;
              } else if (pageURL.match == 'regex' && regexMatch(page, pageURL.value)) {
              	activated = true;
                window.optimizely.push(["activate", id]);
                break;
              }
            }
         	}
   			}
      	if (!activated) {
      		// fake a pageview event. Page will be sent by default if an experiment is running
        	window.optimizely.push(["trackEvent", page]);
      	}
    	});
		}
	}, 500);
  
  function simpleMatch(url1, url2) {
    url1 = url1.replace("http://", "").replace("https://", "");
    url1 = url1.indexOf('?') > -1 ? url1.substring(0, url1.indexOf('?')) : url1;
    url2 = url2.replace("http://", "").replace("https://", "");
    url2 = url2.indexOf('?') > -1 ? url2.substring(0, url2.indexOf('?')) : url2;
    return url1 == url2;
	}

  function exactMatch(url1, url2) {
      return url1 == url2;
  }

  function substringMatch(url1, url2) {
      return url1.indexOf(url2) != -1;
  }

  function regexMatch(url1, url2) {
      return url1.match(url2) !== null;
  }
})();
