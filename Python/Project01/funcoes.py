def saudacao(nome):
    print(f"Ola, {nome}!")


print("\n Chamando a funcao saudacao:")
saudacao("Alice")
saudacao("Bob")

def quadrado(numero):
    resultado = numero ** 2
    return resultado

print("\nChamando funcao quadrado:")
resultado_quadrado = quadrado(6)

print("Resultado da funcao quadrado:", resultado_quadrado)
