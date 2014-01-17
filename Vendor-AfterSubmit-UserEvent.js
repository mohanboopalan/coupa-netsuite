/**
 * Module Description
 * 
 * Version    Date                     Author             Remarks
 * 1.00       25 Oct 2012     rohitjalisatgi
 * 1.10       07 Jan 2014     mohanboopalan      include only vendor logic 
 */

/**
 * The recordType (internal id) corresponds to the "Applied To" record in your script deployment. 
 * @appliedtorecord recordType
 * 
 * @param {String} type Operation types: create, edit, delete, xedit,
 *                      approve, cancel, reject (SO, ER, Time Bill, PO & RMA only)
 *                      pack, ship (IF only)
 *                      dropship, specialorder, orderitems (PO only) 
 *                      paybills (vendor payments)
 * @returns {Void}
 */
function userEventAfterSubmit(type){
    var context = nlapiGetContext();
    var includeonly = context.getSetting('SCRIPT' , 'custscript_vendor_includeonly');
    var custfieldincludeonly = context.getSetting('SCRIPT' , 'custscript_vendor_customfieldincludeonly');
    var IsCallScheduledScript = true;  
    var Isinactive = false;
    var currentid = nlapiGetRecordId();

    if (type == 'create' )
    {
       var newrecord = nlapiGetNewRecord();
       if ( includeonly  != null && includeonly == 'T')
       {
             if ( newrecord.getFieldValue(custfieldincludeonly) == 'F' || newrecord.getFieldValue(custfieldincludeonly) != 'T' )
               {
                   IsCallScheduledScript = false;
               }
        }
  }
  if (type == 'edit' )
  {
      var currentid = nlapiGetRecordId();
      var newrecord = nlapiGetNewRecord();
      var oldrecord = nlapiGetOldRecord();

       if ( includeonly  != null && includeonly == 'T')
       {
             if ( newrecord.getFieldValue(custfieldincludeonly) == 'F' && oldrecord.getFieldValue(custfieldincludeonly) != 'F' )
               {
                   Isinactive = true;
               }
             if ( newrecord.getFieldValue(custfieldincludeonly) == 'F' && oldrecord.getFieldValue(custfieldincludeonly) == 'F' )
               {
                   IsCallScheduledScript = false;
               }
        }
   }
    if (IsCallScheduledScript)
    {
         var params = new Array();
         params['custscript_recordid'] = currentid;
         params['custscript_vendor_isinactive'] = Isinactive;
         nlapiScheduleScript('customscript_vendorscheduled', 'customdeploy_vendordeployment', params);
     }
}
