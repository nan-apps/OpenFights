/**
 * @author Gnan
 * @date 10/08/2103  
 *  This file is part of OpenFights.
    Clonoluchas is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    OpenFights is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with OpenFights.  If not, see <http://www.gnu.org/licenses/>. 
 * 
 * */


fb = function( text ){
    if ( console.debug )
        console.debug( text );
    else if( console.log )
        console.log( text );
}

//key Codes
Controls = {
    Player1 : {
        fire:65,
        shield:83
    },
    Player2 : {
        fire:75,
        shield:76
    }
}

Game = {    
    width: 600,
    height: 300,    
    player1: null,
    player2: null,
    init : function(){
        
        Crafty.init( this.width, this.height );    
      //  Crafty.canvas.init();
        
        
        var y = ( this.height - Player.h ) / 2;
        
        //player 1
        Crafty.e("2D, DOM, Text").attr({ x: Player.x, y: y-50, z:5, w:50 })
                                 .text( 'A: disparo S: escudo' )
                                 .textFont({ size: '9px' });
                         
        this.player1 = Crafty.e('Player').at( 'player1', Player.x, y, '#000' )
            .bind( 'KeyDown', function( e ){
        
                switch ( e.key ){
                    case Controls.Player1.fire: this.chargeFire(); break;
                    case Controls.Player1.shield: this.shield();                    
                }
                
            })
            .bind( 'KeyUp', function( e ){
            
                switch( e.key ){
                    case Controls.Player1.fire: this.fire();  break;
                    case Controls.Player1.shield: this.unshield();  break;                 
                }
                
            });   
        
        
        
        //player 2
        var x2 = this.width - Player.x - Player.w;
        Crafty.e("2D, DOM, Text").attr({ x: x2, y: y-50, z:5, w:50})
                                 .text( 'K: disparo L: escudo' )
                                 .textFont({ size: '9px' });        
                         
        this.player2 = Crafty.e('Player').at( 'player2', x2, y, '#ef8c10' )
            .bind( 'KeyDown', function( e ){
            
                switch ( e.key ){
                    case Controls.Player2.fire: this.chargeFire(); break;
                    case Controls.Player2.shield: this.shield();  break;                    
                }            
                
            })
            .bind( 'KeyUp', function( e ){
        
                switch( e.key ){
                    case Controls.Player2.fire: this.fire();  break;
                    case Controls.Player2.shield: this.unshield();  break;    
                }
                
            }); 
    }
    
};
