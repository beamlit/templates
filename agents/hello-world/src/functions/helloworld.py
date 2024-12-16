from beamlit.functions import function


@function()
def helloworld(query: str):
    """
    Say hello to the world from beamlit
    """
    return "Hello from beamlit"
