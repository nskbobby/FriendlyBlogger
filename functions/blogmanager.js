import { fileURLToPath, pathToFileURL } from "url";
import { dirname } from "path";
import dotenv from 'dotenv';
dotenv.config();

const dircName = dirname(fileURLToPath(import.meta.url)); //url to directory path
const loginpageURL = pathToFileURL(dircName + "/loginpage.js");
const loginpage = await import(loginpageURL);

export var blogdatabase = [
    {
        blogid: 1,
        userid: 1,
        username: "krish",
        blogheading: "When i saw a plane in the clear sky",
        blogcontent: `It was a clear summer afternoon. It's a beautiful day for the pilots who fly on VFR("Visual Flying Rules") . I came up running on to the roof of my house like everything to sight the airplane when i heard the sound of it's massive engines, But this time it's different. The plane is flying low and it's a private charter with Rolls Royce engine. 
        I saw the pilot and in a glance of seconds he saw me from the cockpit waving hand at me.
         That's when fuel added into my ignited dream inside my heart to become a pilot. I was dancing with the joy as pilot waved at me. I was on cloud 9 because it's a private charter which is expensive.
          it's very rare to have this kinda blessing to experience this kinda feeling`,
        postedtime: "oct 14 2024"
    },
    {
        blogid: 2,
        userid: 2,
        username: "john_doe",
        blogheading: "A Day in the Life of a Developer",
        blogcontent: `Being a software developer is both challenging and rewarding. 
        Here’s what my typical day looks like. I usually start my day with a cup of coffee while reviewing my emails and checking the project management tool for any updates. 
        After a brief stand-up meeting with my team, we discuss our priorities for the day. 
        I then dive into coding, often spending hours writing and debugging code. 
        This part of the job can be frustrating, especially when I encounter bugs, but it’s also where I feel most accomplished. 
        Midday, I take a break to stretch and grab lunch. I find that stepping away from the computer helps clear my mind. 
        After lunch, I usually attend a couple of meetings—some to discuss project progress and others to brainstorm new features. 
        In the afternoon, I might spend time reviewing pull requests from my colleagues or learning about new technologies. 
        Finally, I wrap up my day by documenting my work and planning for tomorrow. Overall, every day is unique, and I love the dynamic nature of being a developer.`,
    },
    {
        blogid: 3,
        userid: 3,
        username: "susan",
        blogheading: "Traveling Around the World",
        blogcontent: `I've been to over 10 countries in the past year, and here's what I've learned from each one. 
        Traveling is an enriching experience that allows you to immerse yourself in different cultures and meet diverse people. 
        My journey began in Japan, where I was captivated by the blend of tradition and modernity. 
        From the bustling streets of Tokyo to the serene temples in Kyoto, Japan taught me the importance of respect and mindfulness. 
        Next, I traveled to Italy, where the art, history, and cuisine left a lasting impression. 
        Walking through the streets of Rome, I felt connected to centuries of history. 
        The food in Italy is also something to cherish; each region offers unique flavors and culinary traditions. 
        In Australia, I experienced the beauty of nature, from the Great Barrier Reef to the Outback. 
        Each place I visited offered its own lessons about life, people, and the world. 
        Traveling has not only broadened my horizons but also instilled a sense of gratitude for the experiences I have had.`,
    },
    {
        blogid: 4,
        userid: 4,
        username: "mike_dev",
        blogheading: "Understanding Async Programming",
        blogcontent: `Async programming can be confusing at first, but once you get the hang of it, it makes JavaScript even more powerful. 
        The essence of async programming is to manage operations that may take time to complete without blocking the execution of other code. 
        In traditional programming, when a function is called, the program must wait until that function completes before moving on to the next line of code. 
        This can lead to inefficiencies, especially when dealing with tasks such as API calls or file reading. 
        JavaScript provides several ways to handle asynchronous operations, including callbacks, promises, and async/await. 
        Callbacks were the original method, but they can lead to what is known as "callback hell" when nested too deeply. 
        Promises were introduced to solve this problem, allowing for more readable and manageable asynchronous code. 
        The async/await syntax, built on top of promises, allows us to write asynchronous code that looks synchronous, greatly improving code readability. 
        Mastering async programming is essential for any developer looking to build scalable applications.`,
    },
    {
        blogid: 5,
        userid: 5,
        username: "jane_smith",
        blogheading: "Healthy Eating on a Budget",
        blogcontent: `You don't have to break the bank to eat healthy. Here are my top tips for eating nutritious food on a budget. 
        Eating healthy is often perceived as expensive, but with a bit of planning and creativity, you can enjoy nutritious meals without overspending. 
        First, I recommend creating a weekly meal plan. This helps you avoid impulse buys and ensures that you purchase only what you need. 
        Next, focus on buying seasonal fruits and vegetables. They are often cheaper and taste better when they're in season. 
        Additionally, consider incorporating more plant-based proteins, such as beans and lentils, into your meals. 
        They are not only affordable but also rich in nutrients. 
        Another tip is to shop in bulk for staples like rice, oats, and nuts. 
        Finally, don’t forget about meal prepping; preparing meals in advance can save both time and money throughout the week. 
        With these tips, you can eat healthy without breaking the bank.`,
    },
    {
        blogid: 6,
        userid: 6,
        username: "alex",
        blogheading: "React vs Vue: A Developer’s Perspective",
        postedtime:"Aug 04th 2000",
        blogcontent: `As a front-end developer, I've worked with both React and Vue. Here's my take on their differences and when to use each. 
        Both React and Vue are powerful JavaScript frameworks that enable developers to build dynamic user interfaces, but they have distinct philosophies and ecosystems. 
        React, developed by Facebook, emphasizes a component-based architecture and utilizes a virtual DOM for efficient updates. 
        Its flexibility and rich ecosystem make it an excellent choice for large-scale applications, but it can have a steeper learning curve for newcomers. 
        On the other hand, Vue offers a more straightforward approach, making it beginner-friendly. 
        Its core library focuses on the view layer, while allowing you to integrate with other libraries or existing projects. 
        Vue’s reactivity system is intuitive, which can make development faster for simpler applications. 
        In conclusion, I believe the choice between React and Vue largely depends on the project requirements and team expertise. 
        Both frameworks have their strengths, and understanding their differences can help developers choose the right tool for the job.`,
    }
];





//=================================================TEST END==============//

//function to create a post
export function createpost(req,res,){

var userdetails=loginpage.getuserdetails(process.env.USERID);
var currentUserName=userdetails.username;// username to store session user
var blogtitle=req.body.title ? req.body.title.trim() : '';
var blogcontent=req.body.blogcontent ? req.body.blogcontent.trim() : '';
const time=new Date;


if(blogtitle && blogcontent){
var createdBlog={
    blogid:blogdatabase.length+1,
    userid:process.env.USERID,
    username:currentUserName,
    blogheading:blogtitle,
    blogcontent:blogcontent,
    postedtime:time,
} 
blogdatabase.push(createdBlog); //add posted blog to database
console.log("successfully posted");
res.redirect(`/blogs/${createdBlog.blogid}`);
}else{
    console.log(`empty content. Enter your content `)
    res.redirect('/createpost')
}
}



export function getuserblogs(){
    var userblogs=[];
for(var i=0;i<blogdatabase.length;i++){
if(blogdatabase[i].userid==process.env.USERID){
    userblogs.push(blogdatabase[i]);
}
}


return userblogs;
}


export function getrecentblogs(){
var count=5;
var recentblogs=[];
var length=blogdatabase.length;
while(count>0){
    recentblogs.push(blogdatabase[length-1]);
    count--;
    length--;
}
return recentblogs;
}



export function getblog(blogId){

    for( var i=0;i<blogdatabase.length;i++){
        if(blogdatabase[i].blogid==blogId){
            return blogdatabase[i];
        }
    }
}

export function deleteBlog(res,blogid) {
    // Find the index of the blog with the given blogid
    const blogIndex = toString(blogdatabase.findIndex(blog => {
           return blog.blogid === blogid;
    }));
    // Check if the blog was found
    if (blogIndex !== -1) {
        // Remove the blog from the array
        blogdatabase.splice(blogIndex, 1);
        console.log(`Blog with ID ${blogid} has been deleted.`);
        return res.redirect('/myarticlespage');
    } else {
        console.log(`Blog with ID ${blogid} not found.`);
        return res.redirect('/myarticlespage');
    }
}