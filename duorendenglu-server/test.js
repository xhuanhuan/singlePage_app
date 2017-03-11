var s='';

if(s){
	console.log('hello');
}else
{
	console.log('no');
}
function a(){return 1};
function b(){return 3};
function test(a,b){
	console.log(arguments);
	console.log(a()+b());
}
test(function(){return 1},function(){return 2});