from blaxel.functions import function


@function()
async def helloworld(query: str):
    """
    Say hello to the world from blaxel
    """
    return "Hello from Blaxel"
