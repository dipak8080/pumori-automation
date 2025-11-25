async function waitForResponse(page, apiPath){
    const response = await page.waitForResponse(res=> res.url().includes(apiPath) && res.status() === 200,{timeout:60000});

    try{
        return await response.json();
    }catch{
        return null
    }
}

module.exports = {waitForResponse}