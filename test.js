 let arr=[20,1,45,15,21];
// let newarr=arr.sort();
// console.log(newarr);

// function reverseString(str) {
//     var newString = "";
//     for (var i = str.length - 1; i >= 0; i--) {
//         newString += str[i];
//     }
//     return newString;
// }
// console.log(reverseString('hello'));


// let str="Hello Boy";
// let newstr=""
// for(var i=str.length-1; i >= 0; i--){
//     newstr+=str[i];

// }
// console.log(newstr);

// let x=10;y=20;
// x=x+y;
// y=x-y;
// x=x-y;
// console.log("Y Value ",y);
// console.log("X",x);

const sort=(arr)=>{

    for(let i=0;i<arr.length;i++){

        for(let j=i+1; j<arr.length;j++){

            if(arr[i]>arr[j]){
                let swap=arr[i];
                arr[i]=arr[j];
                arr[j]=swap;
            }
        }
    }
    return arr;

}

//console.log(sort(arr));


// const str = "-1.5";
// //myString.replace(/[^0-9]/g, '');
// console.log(str.replace(/[^0-9d.]/g, ''));


// let newarr="1+2".split(/[+]/);
// console.log(newarr);
// if(newarr.length==1){
//     console.log("Wrong command")
// }else{
//     if(newarr[0]==newarr[1]){
//         console.log("Fine!!");
//     }else{
//         console.log("wrong")
//     }
// }
   
// var splitstring = "A vs B".split('vs');
// console.log(splitstring);


const duplicate=(string)=>{
   let str="";
    for(var i=0;i<string.length;i++){
      let c=string[i];
      if(str.indexOf(c)<0){
          str+=c;
      }

    }
    return str;
}
console.log(duplicate("xxaabcdedffgg"));

//only find out numeric value

console.log("+1".replace(/\+/g,''));

//Only find out String Value

console.log("x6y7z1<1".replace(/[0-9<]/g,''));

//Only find out String Value

console.log("x6y7z1<.1".replace(/\./g,''),'');