/* मेरा संग्रह / My collection
   हर राग के लिए YouTube प्रदर्शन और सुनने के नोट्स यहाँ भरें। राग की कुंजी वही है जो raga-data.js के RAGAS में है
   (जैसे yaman, bhairav, todi, marwa)। नीचे हर कुंजी के लिए यह रूप चलता है:

   yaman: {
       notes: 'इस राग को सुनते समय जो पकड़ में आया, उसके नोट्स (खाली पंक्ति से नया अनुच्छेद)।',
       videos: [
           { url: 'https://www.youtube.com/watch?v=XXXXXXXXXXX',   // या केवल id: 'XXXXXXXXXXX'
             title: 'प्रदर्शन का शीर्षक', artist: 'कलाकार', note: 'छोटी टिप्पणी', start: 0 }   // start सेकंड में (वैकल्पिक)
       ]
   }
*/
const COLLECTION = {
    jog: {
        notes: '',
        videos: [
            { url: 'https://www.youtube.com/watch?v=EFvX7R_CHKk', title: 'Raag Jog', artist: 'Pt. Hariprasad Chaurasia', note: '' }
        ]
    }
};
