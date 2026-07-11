"use client";
import Image from"next/image";import{useState}from"react";import{BrandText}from"./BrandText";
const modes=[
{id:"llegada",label:"Llegada",title:"El acceso prepara la primera escena.",text:"La apertura del acceso puede activar una luz de cortesía y dejar encendidos solo los ambientes definidos.",trigger:"Acceso autorizado",action:"Luz de ingreso",response:"Escena de llegada",dependency:"C