# Intranet LdCars — Gestión Automotriz

Este proyecto es una aplicación web de tipo Intranet desarrollada para la Evaluación Sumativa 3 de la asignatura Programación FrontEnd. Su objetivo es gestionar eficientemente la información de una automotora, incluyendo la administración de inventarios, clientes y agendamiento de visitas.

## Contexto del Proyecto
La aplicación ha sido diseñada para permitir a usuarios internos (Administradores) y externos (Clientes) interactuar con el sistema de la automotora "LdCars". Se ha desarrollado utilizando React + TypeScript y utiliza LocalStorage como motor de persistencia de datos.

## Funcionalidades Implementadas
La Intranet cuenta con los siguientes módulos operativos:

1.  Autenticación de Usuarios:Sistema de login y registro de clientes con validaciones de formato (email, teléfono) y contraseñas seguras.
2.  Gestión de Vehículos (CRUD):Permite crear, visualizar, editar y eliminar vehículos. Incluye buscador en tiempo real y persistencia en LocalStorage.
3.  Gestión de Repuestos (CRUD): Módulo para administrar artículos, visualización de detalles con imágenes y carrito de compras para clientes.
4.  Sistema de Reservas: Los clientes pueden agendar visitas a los vehículos. Incluye validaciones de fecha (no permite fechas pasadas) y formularios de contacto.
5.  Carrito de Compras: Sistema persistente para la selección de repuestos, con cálculo total y vaciado al confirmar compra.
6.  Gestión de Equipo: Módulo para administrar al personal (colaboradores) de la empresa.
7.  Modo Oscuro: Interfaz adaptable mediante switch para mejorar la experiencia de usuario.

## Tecnologías Utilizadas
*   Frontend: React (Vite)
*   Lenguaje: TypeScript
*   Estado Global: React Context API (`useContext`)
*   Persistencia: LocalStorage API
*   Enrutamiento: React Router Dom

## Instalación y Ejecución

Para ejecutar este proyecto localmente, asegúrate de tener instalado [Node.js](https://nodejs.org/).

1. Clonar repositorio
```
   git clone https://github.com/jonnett/ldcars-project
   cd ldcars-project

2. Instalar las dependencias:
    npm install

3.Para ejectuar:
    npm run dev