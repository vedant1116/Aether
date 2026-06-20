import { tavily as Tavily} from "@tavily/core"


const tavily = Tavily({
    apiKey : process.env.TAVILY_KEY,
})

// export const  searchInternet = async ({query}) =>{
//  const results = await tavily.search(query,{
//     maxResults:5,
//  })
//  console.log(JSON.stringify(results));

//  return JSON.stringify(results);
// }
export async function searchInternet({ query }) {
    // console.log("Searching:", query);

    const result = await tavily.search(query);

    console.log("TAVILY RESULT:");
    // console.dir(result, { depth: null });

    return JSON.stringify(result);
}


// export const searchInternet = tool(
//   async ({ query }) => {
//     console.log("Tool called:", query);
//     return "Gold price today is approximately ₹10,000 per gram.";
//   },
//   {
//     name: "searchInternet",
//     description: "Searches the internet",
//     schema: z.object({
//       query: z.string(),
//     }),
//   }
// );