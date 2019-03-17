 import Q1 from "@/assets/images/aqi/Q1.png";
 import Q2 from "@/assets/images/aqi/Q2.png";
 import Q3 from "@/assets/images/aqi/Q3.png";
 import Q4 from "@/assets/images/aqi/Q4.png";
 import Q5 from "@/assets/images/aqi/Q5.png";
 import Q6 from "@/assets/images/aqi/Q6.png";
 import Q7 from "@/assets/images/aqi/Q7.png";
 export default {

   methods: {
     getIcon(aqi) {
       var icon = Q7;
       if (!isNaN(aqi)) {
         if (aqi > 0 && aqi <= 50) {
           icon = Q1;
         } else if (aqi > 51 && aqi <= 100) {
           icon = Q2;
         } else if (aqi > 101 && aqi <= 150) {
           icon = Q3;
         } else if (aqi > 151 && aqi <= 200) {
           icon = Q4;
         } else if (aqi > 201 && aqi <= 300) {
           icon = Q5;
         } else if (aqi > 301) {
           icon = Q6;
         }
       }
       return icon;
     },
     getAqiText(aqi) {
       var text = "N/A";
       if (!isNaN(aqi)) {
         if (aqi > 0 && aqi <= 50) {
           text = '优';
         } else if (aqi > 51 && aqi <= 100) {
           text = '良';
         } else if (aqi > 101 && aqi <= 150) {
           text = '轻度污染';
         } else if (aqi > 151 && aqi <= 200) {
           text = '中度污染';
         } else if (aqi > 201 && aqi <= 300) {
           text = '重度污染';
         } else if (aqi > 301) {
           text = '严重污染';
         }
       }
       return text;
     },
     getAqiColorAlpha(aqi) {
       var color = '#80808078';
       if (!isNaN(aqi)) {
         if (aqi > 0 && aqi <= 50) {
           color = '#0080004d';
         } else if (aqi > 51 && aqi <= 100) {
           color = '#ffff004d';
         } else if (aqi > 101 && aqi <= 150) {
           color = '#ffa50047';
         } else if (aqi > 151 && aqi <= 200) {
           color = '#ff000042';
         } else if (aqi > 201 && aqi <= 300) {
           color = '#80008078';
         } else if (aqi > 301) {
           color = '#8000007d';
         }
       }
       return color;
     },
     getAqiColor(aqi) {
       var color = 'grey';
       if (!isNaN(aqi)) {
         if (aqi > 0 && aqi <= 50) {
           color = 'green';
         } else if (aqi > 51 && aqi <= 100) {
           color = 'yellow';
         } else if (aqi > 101 && aqi <= 150) {
           color = 'orange';
         } else if (aqi > 151 && aqi <= 200) {
           color = 'red';
         } else if (aqi > 201 && aqi <= 300) {
           color = 'purple';
         } else if (aqi > 301) {
           color = 'maroom';
         }
       }
       return color;
     },
     getAqiLength(aqi) {
       var l = 10000;
       if (!isNaN(aqi)) {
         if (aqi > 0 && aqi <= 50) {
           l += 1000;
         } else if (aqi > 51 && aqi <= 100) {
           l += 2000;
         } else if (aqi > 101 && aqi <= 150) {
           l += 3000;
         } else if (aqi > 151 && aqi <= 200) {
           l += 4000;
         } else if (aqi > 201 && aqi <= 300) {
           l += 5000;
         } else if (aqi > 301) {
           l += 6000;
         }
       }
       return l;
     }

   }
 }