var canvas, ctx, imgfondo;
var obj = [];
function parametros(){
    var n=0;
    
    //ParÃ¡metros de la animaciÃ³n
    rutafondo='fondo.png';
    
    //animacion(x1,y1,x2,y2,velocidad,tiempo_inicio,tiempo_final)
    n=obj.length;
    obj[n]=new animacion(0,100,300,100,1,0,300);
    obj[n].anyadir_sprite(331,352,23,53);
    obj[n].anyadir_sprite(360,352,23,53);
    obj[n].anyadir_sprite(389,352,23,53);
    obj[n].velocidad_cambio=10;
    obj[n].infinito=true;

    //Fin de ParÃ¡metros
}
$(document).ready(inicializarEventos);
$(window).load(function(){  
    dibujaranimacion();
});
function dibujaranimacion(){
    var chi=false;
    for(var j=0;j<obj.length;j++){
        if (obj[j].infinito){
            chi=true;
            break;
        }
        if (obj[j].acabado!=1){
            chi=true;
            break;
        }       
    }   
    if (chi){
        requestAnimationFrame(dibujaranimacion);
        fondo();
        for(var i=0;i<obj.length;i++){
            obj[i].animar();
        }
    }
}
function fondo(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(imgfondo,0,0,canvas.width, canvas.height,0,0,canvas.width,canvas.height);
}
function inicializarEventos(){
    parametros();
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled=false;
    
    var gradienteLineal = ctx.createLinearGradient(0,0,430,100); 
    gradienteLineal.addColorStop(0, '#2787B7');
    gradienteLineal.addColorStop(0.5, '#5ABFF5');
    gradienteLineal.addColorStop(1, '#268BC1');
    ctx.fillStyle = gradienteLineal;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    imgfondo= new Image();
    imgfondo.src = rutafondo;
}

function animacion_texto(texto,x1,y1,x2,y2,font,color_texto,velocidad,tiempo_inicio,tiempo_final){
    this.tiempo=0;
    this.acabado=0;
    this.infinito=false;
    this.x1=x1;
    this.y1=y1;
    this.x2=x2;
    this.y2=y2;
    this.texto=texto;
    this.font=font;
    this.color_texto=color_texto;
    this.velocidad=velocidad;
    this.tiempo_inicio=tiempo_inicio;
    this.tiempo_final=tiempo_final;
    this.varx=x1;
    this.vary=y1;
    this.conservarimg=true;
    this.sombra_espesor=0;
    this.sombra_color='rgba(0, 0, 0, 1)';
    this.maximotexto=0;
    this.fadeinicio=false;
    this.fadefinal=false;
    
    if (this.x2==this.x1){
        this.pendiente=0;
    }else{
        this.pendiente=(this.y2-this.y1)/(this.x2-this.x1);
    }
    this.direccion=calcular_direccion(this.x1,this.y1,this.x2,this.y2);
    
    this.animar=function animar(){              
        this.dibujar_fondo();
        this.tiempo++;          
        if (this.tiempo>this.tiempo_final){
            if (this.infinito){
                this.resetear();
            }else{
                this.acabado=1;
            }           
        }               
    }
    
    this.resetear=function resetear(){
        this.tiempo=0;
        this.acabado=0;
        this.varx=this.x1;
        this.vary=this.y1;
    }
    this.dibujar_fondo=function dibujar_fondo(){
        var chi=false;
        if (this.tiempo>=this.tiempo_inicio && this.tiempo<=this.tiempo_final){
            if (this.direccion==3){
                            if ((this.varx+this.velocidad)<=this.x2){
                                this.varx+=this.velocidad;
                                this.vary=this.pendiente*(this.varx-this.x1)+this.y1;
                            }
            }else if (this.direccion==4){
                            if ((this.varx-this.velocidad)>=this.x2){
                                this.varx-=this.velocidad;
                this.vary=this.pendiente*(this.varx-this.x1)+this.y1;
                            }
            }else if (this.direccion==1){
                            if ((this.vary+this.velocidad)<=this.y2){
                               this.vary+=this.velocidad; 
                            }
            }else if (this.direccion==2){
                            if ((this.vary-this.velocidad)>=this.y2){
                                this.vary-=this.velocidad;
                            }
            }
            chi=true;
        }else{
            if (this.conservarimg && this.tiempo>this.tiempo_final){
                chi=true;
            }
        }
        if (chi){
            ctx.font = this.font;
            ctx.fillStyle=this.color_texto;
            if (this.fadeinicio){
                if (this.tiempo>=this.tiempo_inicio && this.tiempo<=this.tiempo_inicio+60){
                    ctx.globalAlpha=(this.tiempo-this.tiempo_inicio)/60;
                }
            }
            if (this.fadefinal){
                if (this.tiempo>=this.tiempo_final-80){
                    ctx.globalAlpha=(this.tiempo_final-this.tiempo)/60;
                }
            }
            
            if (this.sombra_espesor>0){
                ctx.shadowBlur = this.sombra_espesor;
                ctx.shadowColor = this.sombra_color;
            }else{
                ctx.shadowBlur = 0;
            }
            if (this.maximotexto!=0){
                ctx.fillText(this.texto,this.varx,this.vary,this.maximotexto);
            }else{
                ctx.fillText(this.texto,this.varx,this.vary);
            }
            ctx.globalAlpha=1;
        }
    }
}
function animacion(x1,y1,x2,y2,velocidad,tiempo_inicio,tiempo_final){   
    this.tiempo=0;
    this.acabado=0;
    this.x1=x1;
    this.y1=y1;
    this.x2=x2;
    this.y2=y2;
    this.velocidad=velocidad;
    this.tiempo_inicio=tiempo_inicio;
    this.tiempo_final=tiempo_final;
    this.varx=x1;
    this.vary=y1;
    this.conservarimg=true;
    this.objsprites=[];
    this.nimagenalterna=0;
    this.nimagenalterna2=0;
    this.velocidad_cambio=10;
    this.infinito=false;
    this.fadeinicio=false;
    this.fadefinal=false;
    
    if (this.x2==this.x1){
        this.pendiente=0;
    }else{
        this.pendiente=(this.y2-this.y1)/(this.x2-this.x1);
    }
    this.direccion=calcular_direccion(this.x1,this.y1,this.x2,this.y2);
    this.animar=function animar(){              
        this.dibujar_fondo();
        this.tiempo++;          
        if (this.tiempo>this.tiempo_final){
            if (this.infinito){
                this.resetear();
            }else{
                this.acabado=1;
            }           
        }               
    }
    
    this.anyadir_sprite=function anyadir_sprite(x1,y1,ancho,alto){
        var n=this.objsprites.length;       
        this.objsprites[n]=x1+'|'+y1+'|'+ancho+'|'+alto;
    }
    
    this.resetear=function resetear(){
        this.tiempo=0;
        this.acabado=0;
        this.varx=this.x1;
        this.vary=this.y1;
    }
    this.dibujar_fondo=function dibujar_fondo(){
        var chi=false;
        if (this.tiempo>=this.tiempo_inicio && this.tiempo<=this.tiempo_final){
            if (this.direccion==3){
                            if ((this.varx+this.velocidad)<=this.x2){
                                this.varx+=this.velocidad;
                                this.vary=this.pendiente*(this.varx-this.x1)+this.y1;
                            }
            }else if (this.direccion==4){
                            if ((this.varx-this.velocidad)>=this.x2){
                                this.varx-=this.velocidad;
                this.vary=this.pendiente*(this.varx-this.x1)+this.y1;
                            }
            }else if (this.direccion==1){
                            if ((this.vary+this.velocidad)<=this.y2){
                               this.vary+=this.velocidad; 
                            }
            }else if (this.direccion==2){
                            if ((this.vary-this.velocidad)>=this.y2){
                                this.vary-=this.velocidad;
                            }
            }
            chi=true;
        }else{
            if (this.conservarimg && this.tiempo>this.tiempo_final){
                chi=true;
            }
        }
        if (chi){
            if (this.objsprites.length>0){  
                var aux=this.objsprites[this.nimagenalterna2].split('|');
                if (this.acabado==0){                   
                    var total=this.objsprites.length*this.velocidad_cambio;
                    
                    if ((this.nimagenalterna+1)%this.velocidad_cambio==0){
                        this.nimagenalterna2++;
                        this.nimagenalterna++;              
                        if (this.nimagenalterna>=total){
                            this.nimagenalterna=0;
                            this.nimagenalterna2=0;
                        }
                    }else{
                        this.nimagenalterna++;
                    }
                }
                if (this.fadeinicio){
                    if (this.tiempo>=this.tiempo_inicio && this.tiempo<=this.tiempo_inicio+60){
                        ctx.globalAlpha=(this.tiempo-this.tiempo_inicio)/60;
                    }
                }
                if (this.fadefinal){
                    if (this.tiempo>=this.tiempo_final-80){
                        ctx.globalAlpha=(this.tiempo_final-this.tiempo)/60;
                    }
                }
                
                ctx.shadowBlur=0;
                ctx.drawImage(imgfondo,aux[0],aux[1],aux[2],aux[3],this.varx,this.vary,aux[2],aux[3]);
                ctx.globalAlpha=1;
            }
            
        }
    }
}
function calcular_direccion(x1,y1,x2,y2){
    var direccion=0;
    if ((x1==x2) && (y1==y2)){
        direccion=0; //EstÃ¡tico
    }else if (x1==x2){
        if (y1<y2){
            direccion=1; //Arriba -> Abajo
        }else if (y1>y2){ 
            direccion=2; //Abajo -> Arriba
        }
    }else if (y1==y2){
        if (x1<x2){
            direccion=3; //Izquierda -> Derecha
        }else if (x1>x2){
            direccion=4; //Derecha -> Izquierda
        }
    }else{
        if (x1<x2){
            direccion=3; //Izquierda -> Derecha
        }else{
            direccion=4; //Derecha -> Izquierda
        }
    }
    return direccion;
}