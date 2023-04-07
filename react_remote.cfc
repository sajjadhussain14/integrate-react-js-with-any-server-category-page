<cfcomponent name="react_remote">
<cfscript>
        remotedata = new functions.VendorDataLocal(); 
    </cfscript>
	<cffunction name="addToCart" access="remote" returnFormat="json">
	
		<cfargument name="ID" type="any" required="false" />
		<cfargument name="SKU" type="any" required="false" />
		<cfheader name="Access-Control-Allow-Origin" value="*" >
		<cfset resData=structnew() >
		<cfset resData.id=arguments.ID >
		<cfif  ((isdefined("arguments.SKU") and val(arguments.SKU) eq 0)) and isdefined("arguments.ID") and val(arguments.ID)>
 			<cfset product=remotedata.getproductbyproductid(application.profile_id,application.distributor_ids,arguments.ID,application.use_custom_taxonomy)>
 			<cfif not len(product.brand)>
 				<cfset product.brand="GENERIC">
 			</cfif>
			<cfif val(product.below_map_price) and val(product.price) eq 2000000 and not (isdefined("resp.id") and val(resp.id))> 
				<cfset sellingprice=product.map>
				<cfelseif val(product.below_map_price)>
				<cfset sellingprice=product.below_map_price>
				<cfelse>
 				<cfset sellingprice=product.price>
			</cfif>
			<cfif (isdefined("form.VARIATION_ID") and val(form.VARIATION_ID) )>
				<cfset variation=remotedata.getproductvariationsbyvariationid(application.profile_id,application.distributor_ids,form.VARIATION_ID,application.use_custom_taxonomy)>
				<cfset upc=variation.upc>
				<cfset WEB_PRODUCT_NAME=variation.name>
				<cfelse>
				<cfset upc=product.upc>
				<cfset WEB_PRODUCT_NAME=product.WEB_PRODUCT_NAME>
			</cfif>
			<cfif isdefined("application.overwritecloudprices") and application.overwritecloudprices and len(upc)>
				<cfset ProductLogic = new functions.products()>
				<cfset overwriteprice=ProductLogic.getpricebyupc(product.upc)>
				<cfif val(overwriteprice.price)>
					<cfset sellingprice=overwriteprice.price>
				</cfif>
			</cfif>
 			<cfset is_firearm=remotedata.isfirearm(application.profile_id,application.distributor_ids,product.upc)>
			<cfif isdefined("is_firearm.recordCount") and is_firearm.recordCount>
				<cfset is_firearm='Y'>
				<cfset must_serial='Y'>
				<cfelse>
				<cfset is_firearm='N'>
				<cfset must_serial='N'>
			</cfif>
			<cfscript>
			CartLogic = new functions.cart();
			CartLogic.createstyleonthefly(REReplace(left(upc,20),"[^0-9A-Za-z ]","","all"),REReplace(left(product.style,20),"[^0-9A-Za-z ]","","all"),REReplace(left(product.brand,20),"[^0-9A-Za-z ]","","all"),REReplace(left(WEB_PRODUCT_NAME,80),"[^0-9A-Za-z ]","","all"),val(sellingprice),val(product.avg_cost),'WEB PRODUCTS','MAP ME',product.picturepath,is_firearm,must_serial,'#trim(product.part_num)#',#val(product.vend_integrate_id)#);
			</cfscript>
			<cfquery name="getsku_id" datasource="#application.ds#">
				select a.sku_id,a.STYLE_ID from tb_skus a left join tb_sku_lookups b on (a.sku_id=b.sku_id and len(b.lookup) > 10 ) where lookup='#REReplace(left(upc,20),"[^0-9A-Za-z ]","","all")#'
			</cfquery>
			<cfquery name="upddesc2" datasource="#application.ds#">
				update tb_styles set description_2='#product.picturepath#' where style_id=#val(getsku_id.style_id)#
			</cfquery>
			<cfquery name="upddesc2" datasource="#application.ds#">
				update tb_sku_buckets set store_price=#val(sellingprice)# where sku_id=#val(getsku_id.sku_id)#
			</cfquery>
			<cfset arguments.SKU=getsku_id.sku_id>
		</cfif>
		<cfif isdefined("product.vend_integrate_id") and val(product.vend_integrate_id)>
			<cfset vendor_code='#val(product.vend_integrate_id)#'>
			<cfelse>
			<cfset vendor_code=''>
		</cfif>
		<cfset ItemC = 0>
		<cfscript> 
			try{
			CumHelper = new functions.CumulusHelper();
			CartLogic2 = new functions.cart();
			CartTokenObj = CumHelper.GetCartToken();
			NewCartInfo = CartLogic2.CreateWebCartByCartTokenObj(CartTokenObj);
			CartLogic2.AddProductToCart(val(trim(arguments.SKU)),val(1),NewCartInfo,vendor_code); 
			WC = CartLogic2.GetWebCart(CumHelper);
			}catch(any e){
				writedump(e);
				abort;
				arrayAppend(session.ErrorArray,e.message);  
				CFLOCATION(url:cgi.HTTP_REFERER,addToken:"no");
			}
  		</cfscript>
		
		<cfif isdefined("WC") and WC.recordcount gt 0>
			
			<cfset resData.Success= "True" >
			<cfset resData.cartConid=WC.CARTCONID >
			<cfset ItemC = 0/>
			<cfloop query="WC">
			<cfset ItemC = ItemC + val(WC.QTY)/>
			</cfloop>
			<cfset resData.QTY=val(ItemC) >
			<cfelse>
			<cfset resData.Success= "False" >
			<cfset resData.cartConid=0 >
			<cfset resData.QTY=0 >
		</cfif>
		
		<cfreturn resData>
	</cffunction>
</cfcomponent>