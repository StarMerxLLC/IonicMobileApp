function SupplierModel(supplierObj) {
	supplierObj.name=((typeof supplierObj.name)=='undefined')?'':supplierObj.name;
	supplierObj.contact=((typeof supplierObj.contact)=='undefined')?'':supplierObj.contact;
	supplierObj.telephone=((typeof supplierObj.telephone)=='undefined')?'':supplierObj.telephone;
	supplierObj.location=((typeof supplierObj.location)=='undefined')?'':supplierObj.location;
	supplierObj.url=((typeof supplierObj.url)=='undefined')?'':supplierObj.url;
	supplierObj.email=((typeof supplierObj.email)=='undefined')?'':supplierObj.email;
	supplierObj.beizhu=((typeof supplierObj.beizhu)=='undefined')?'':supplierObj.beizhu;
	return supplierObj;
}

function ProductModel(productlist){
	for(var i=0; i<productlist.length; i++)
	{
		if(productlist[i].offerprice==null)
		{
			productlist[i].offerprice=0;
		}
		if(productlist[i].lead_time==null)
		{
			productlist[i].lead_time=0;
		}
		if(productlist[i].MOQ==null)
		{
			productlist[i].MOQ=0;
		}

	}
	return productlist;
}

