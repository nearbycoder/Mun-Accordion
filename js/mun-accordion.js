(function() {
  'use strict'
  angular
  	//instantiate module for accordion.
  	//naming scheme comes from Dave Smiths talk about using company initial for the beginning of your directives
  	//Reference: https://www.youtube.com/watch?v=UMkd0nYmLzY
    .module('munAccordion', [])
    //controller created to store simple logic for the directive state
    .controller('munAccordionController', ['$scope', function($scope){
    	//create array to hold accordion Items state
      var accordionItems = []
      //on each accordion header click check if multiple="true" is set, else set all accordion items to false.
      this.openAccordionItem = function(accordionItemToOpen) {
        if( !$scope.multiple ) {
          accordionItems.forEach(function(accordionItem) {
            accordionItem.isOpenned = false
          })
        }
        //set currently clicked AccordionItem to opened.
				accordionItemToOpen.isOpenned = true          
      }
      //Function ran on intial load to get all accordionItem in accordionItems array.
      this.addAccordionItem = function(accordionItem) {
        accordionItems.push(accordionItem)
      }
    }])
    //Directive for outside wrapper. 
    .directive('munAccordion', function() {
	    return {
	    	//restrict to element tag
	      restrict: 'E',
	      //allow for inside directive accordionItem to be inserted inside munAccordion.
	      transclude: true,

	      scope: {
	      	//one way bind the multiple boolean
	        multiple: '@'
	      },
	      controller: 'munAccordionController',
	      template: '<div class="accordion" ng-transclude></div>'
	    }
  	})
  	//Main directive for each accordion item.
    .directive('accordionItem', function() {
	    return {
	      require: '^munAccordion',
	      //restrict to element tag
	      restrict: 'E',
	      //allow for resuability enabling consumers of the directive to add their own content.
	      transclude: true,
	      scope: {
	      	//one way bind the itemTitle and initiallyOpoen boolean
	        itemTitle: '@',
	        initiallyOpen: '@'
	      },
	      link: function(scope, element, attrs, accordionController) {
	      	//set isOpened on accordionItem with initiallyOpen true.
	        scope.isOpenned = (scope.initiallyOpen) ? true : false
	        //push the state of each accordionItem to the accordionController
	        accordionController.addAccordionItem(scope)
	        //simple function to check isOpenned state and apply the openAccordionItem function from the accordionController passing the item clicked.
	        scope.toggleAccordionItem = function () {
	          if(!scope.isOpenned) {
	            accordionController.openAccordionItem(this)
	          } else {
	            scope.isOpenned = false
	          }
	        }
	      },
	      template: '\
	      <div class="accordion-item" ng-class="{open: isOpenned, closed: !isOpenned}"> \
	        <div class="accordion-header" ng-click="toggleAccordionItem()"> \
	        	<i class="fa fa-arrow-circle-right" ng-class="{rotate: isOpenned}"></i> \
		        <span>{{itemTitle}}</span> \
	        </div> \
	        <div class="accordion-body"> \
	        	<div class="content" ng-transclude></div> \
	        </div> \
	      </div>'
	    }
  	})
})()