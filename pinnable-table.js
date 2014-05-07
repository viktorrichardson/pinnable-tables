/*!
 * Pinnable Table
 * Version : 0.0.1
 *
 * Requires jQuery - http://jquery.com/
 *
 * Copyright 2014 Viktor Richardson, Spinit AB
 * Released under the MIT license
 * You are free to use Pinnable Table in commercial projects as long as this copyright header is left intact.
 *
 * Date: Apr 1, 2014
 */
 
(function ( $ ) {

  $.fn.extend({
    pinnableTable: function(options) {
      
      var defaults = {
          hoverClass: 'tr-hover'              //class added when hovering a row.
      };
      options =  $.extend(defaults, options);
    
      //Loop trough all pinnable tables
      return this.each(function(i) {
        var hasPinnedLeft = false;
        var hasPinnedRight = false;
        var origTable = $(this);
        var origClone = $(origTable).clone();
        var wrapper;
        var parentContainer = options.parentContainer;
        
        //Insert new clone after original
        $(origTable).after($(origClone));
      
        //Recalculate widths
        //recalculate(['all','left','right','pinned', 'unpinned'])
        //sets all table container widths by default.
        function recalculate(tableContainer) {
        
          //Show the pinned table if hidden
          $(wrapper).animate({opacity: 1});
          $(wrapper).css('height','auto');
          
          //Set container widths
          var leftTableWidth = $('.pinned-left', wrapper).innerWidth() || 0;
          var rightTableWidth = $('.pinned-right', wrapper).innerWidth() || 0;
          var origWidth = $(origTable).width();
          
          if(!tableContainer || tableContainer === 'all' || tableContainer === 'pinned' || tableContainer === 'left') {
            $('.pinned-left', wrapper).width(leftTableWidth);
          }
          if(!tableContainer || tableContainer === 'all' || tableContainer === 'pinned' || tableContainer === 'right') {
            $('.pinned-right', wrapper).width(rightTableWidth);
          }
          if(!tableContainer || tableContainer === 'all' || tableContainer === 'unpinned') {
            $('.pinned-none, .scrollable-table', wrapper).width(origWidth-leftTableWidth-rightTableWidth);
          }
          
        }
        
        /** (not used)
        //Removes pinned table and shows original
        function destroy() {
          $(wrapper).remove();
          $(origTable).removeClass('original-table');
          return this;
        }
        **/
        
        /** (not used)
        //Destroys and reinitiates pinned tables. Use to update the data if original has changed
        function recreate() {
          destroy();
          origClone = $(origTable).clone();
          $(origTable).after($(origClone));
          init();
          return this;
        }
        **/
        
        //Initiate
        function init() {
            $(origTable).addClass('original-table');

            //Set all td pin-classes based on their th-class.
            $(origClone).find('th.pin-left').each(function() {
              hasPinnedLeft = true;
              var index = $(this).index() + 1;
              $(origClone).find('td:nth-child('+index+')').addClass('pin-left');
            });
            
            $(origClone).find('th.pin-right').each(function() {
              hasPinnedRight = true;
              var index = $(this).index() + 1;
              $(origClone).find('td:nth-child('+index+')').addClass('pin-right');
            });
            
            //Create wrappers
            $(origClone).wrap('<div class="pinned-table" style="opacity:0; height:0;"><div class="pinned-none"><div class="scrollable-table"></div></div></div>');
            wrapper = $(origClone).parents('.pinned-table');
            
            $(wrapper).removeClass('pinnable-table');
            $(wrapper).attr('id','pinnedTable'+i);
            //Replicate the margins of the original table to the wrapper
            $(wrapper).css('margin',$(origTable).css('margin'));
            //Remove the ID from the clone
            $(origClone).removeAttr('id');
            
            //Create pinned-left wrapper
            if(hasPinnedLeft) {
              $(wrapper).prepend('<div class="pinned-left"></div>');
              //Clone and insert the original wrapper
              $('.pinned-left', wrapper).html($(origClone).clone());
            }
            //Create pinned-right wrapper
            if(hasPinnedRight) {
              $(wrapper).append('<div class="pinned-right"></div>');
              //Clone and insert the original wrapper
              $('.pinned-right', wrapper).html($(origClone).clone());
            }
            
            //Set hoverClass on rows on mouseover event
            if(options.hoverClass !== "") {
              $(wrapper).find('tbody tr').mouseover(function(e) {
                var hoverIndex = $(e.currentTarget).index()+1;
                $(wrapper).find('tbody tr:nth-child('+hoverIndex+')').addClass(options.hoverClass);
                
                //Bind mouseout
                $(wrapper).find('tbody tr:nth-child('+hoverIndex+')').mouseout(function() {
                  $(wrapper).find('tbody tr:nth-child('+hoverIndex+')').removeClass(options.hoverClass);
                });
              });
            }
            
            //calculate the widths of all containers
            recalculate('all');
            
        }
        
        //Initialize
        init();

        //Listen for resize event
        $(window).resize(function () {
          //recalculate only the unpinned table container
          recalculate('unpinned');
        });
    });
    }
  });
}( jQuery ));