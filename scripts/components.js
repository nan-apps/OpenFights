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

Ammo = {
    
    
};

Player = {
    w:50,
    h:50,
    x: 50 //margin
};

PowerBar = {
    w:0,
    h:5,
    x: 50 //margin
};

Crafty.c('Global', {
    init: function() {
        this.requires('2D, DOM, Color');
    }
});

Crafty.c('Player', {
    id:null,
    life: 100,
    scoreText: null,
    width: Player.w,
    height: Player.h,
    xPos: 0,
    yPos: 0,
    eShield: null,
    startTimerFire: null,  
    pColor: null,
    powerBar: null,
    init: function() {
        e = this;
        this.requires('Global, Collision, Keyboard, Text');
        this.css({
            '-webkit-border-radius': '10px',
            '-moz-border-radius': '10px',
            'border-radius': '10px'
        });
        this.attr({ z : 2 });           
    },
    at: function(id, x, y, color) {
        this.id = id;
        this.xPos = x;
        this.yPos = y;
        this.attr({
            x: this.xPos,
            y: this.yPos,
            w: this.width,
            h: this.height
        });
        this.pColor = color;
        this.color( this.pColor );
        
        this.scoreText = Crafty.e("2D, DOM, Text").attr({ x: this.x+9, y: this.y+5, z:5 }).text( this.life )
                                                                         .textColor( '#FFFFFF', 1 )
                                                                         .textFont({ size: '15px', weight: 'bold' });
        
        this.powerBar = Crafty.e('PowerBar').at( this );
        
        return this;
    },    
    chargeFire: function(){
        this.startTimerFire = new Date().getTime();  
        this.powerBar.increase();
    },        
    fire: function() {
        Crafty.e('Fire').ammo( this );
    },
    shield: function(){
        this.eShield = Crafty.e('Shield').shield( this );        
    },
    unshield: function(){
        if( this.eShield != null )
            this.eShield.destroy();
    },
    harm: function( damage ){

        this.life = this.life - damage;
        this.scoreText.text( this.life );
        if (this.life < 0){
            this.death();
        }
    },
    death: function(){
        this.scoreText.text( 'RIP' );        
        Game.player1.unbind('KeyDown').unbind('KeyUp');
        Game.player2.unbind('KeyDown').unbind('KeyUp');
    }
});


Crafty.c('PowerBar', {
    width: PowerBar.w,
    height: PowerBar.h,
    xPos:null,
    yPos:null,
    init:function(){
        this.requires('Global, Tween');
        this.attr({             
            w : this.width,
            h : this.height,
            z : 3
        });     
        fb(this);
    },
    at: function( player ){
        this.xPos = player.xPos
        this.yPos = player.yPos + Player.h + 20
        this.attr({ 
            x : this.xPos,
            y : this.yPos
        });           
        this.color(player.pColor );
        
        return this;
    },
    increase: function(){
        this.tween( {w: Player.w}, 1500 ); 
    },
    reset: function(){
        this.cancelTween('w');
        this.attr( { w : 0 } ); 
    }
});    

Crafty.c('Fire', {        
    player: null,
    damage: null,     
    power:5,
    speed: 2300,     
    init: function() {
        this.requires('Global, Collision, Tween');
        this.css({
            '-webkit-border-radius': '5px',
            '-moz-border-radius': '5px',
            'border-radius': '5px'
        });
        this.onHit('Player', function( player ) {            
            var damage = this.w;
            player[0].obj.harm( damage );
            this.destroy();
        });
        this.onHit('Shield', function( shield ) {            
            if( this.player.id == shield[0].obj.player.id )
                return;
            
            var damage = this.damage - shield[0].obj.shieldPower;
            
            if( damage > 0 )
                shield[0].obj.player.harm( damage );
            
            this.destroy();
            
        });
    },
    ammo: function( player ) {
        
        this.player = player;
        
        var ammoSize = this.getAmmoSize( player.startTimerFire );
        this.damage = ammoSize;
        
        var centerX = Game.width / 2;
        var y = player.yPos + player.height / 2 - ammoSize / 2;
        var x;
        var direction;

        if (player.xPos < centerX) {             
            x = player.xPos + player.width + ammoSize + 6;
            direction = Game.width;
        }
        else{            
            x = player.xPos - ammoSize - 6;
            direction = 0;            
        }
        
        this.attr({
            x: x,
            y: y,
            w: ammoSize,
            h: ammoSize
        });
        
        this.tween( {x: direction}, this.speed );
        
        player.powerBar.reset();
        
        this.color( player.pColor );
        
        return this;
    },
    getAmmoSize: function( startTimestamp ){
        
        var endTimestamp = new Date().getTime();
        var chargingTime = ( endTimestamp - startTimestamp ) / 1000;
        
        var size = 0;
        
        if( chargingTime < 0.9 )
            size = this.power*1; 
        else if( chargingTime >= 0.9 && chargingTime < 1.5 ) 
            size = this.power*2;    
        else if( chargingTime >= 1.5 )
            size = this.power*3;
        
        return size;
    }
});


Crafty.c( 'Shield', {    
    shieldPower: 5,
    increaseFactor: 10,
    width: 0,
    height: 0,
    player: null,
    init: function(){        
        this.requires( 'Global, Delay' );
        this.color( '#e7e83b' );
        this.css({
            '-webkit-border-radius': '30px',
            '-moz-border-radius': '30px',
            'border-radius': '30px'
        });
    },
    increaseShield: function(){
        this.width = this.width + this.increaseFactor;
        this.height = this.height + this.increaseFactor;
        this.shieldPower = this.shieldPower + 5;
        
        this.attr({
            w: this.width,
            h: this.height,
            x: this.player.xPos - ( (this.width - this.player.w)/2 ),
            y: this.player.yPos - ( (this.height - this.player.h)/2 )
        });
        return this;
    },        
    shield: function( player ){ 
        
        this.player = player;
        this.width = player.w + 20;
        this.height = player.h + 20,
        
        this.attr({
            w: this.width,
            h: this.height,
            x: player.xPos - ( (this.width - player.w)/2 ),
            y: player.yPos - ( (this.height - player.h)/2 ),
            z:1
        });
        var cont = 0;
        this.delay( function(){
           cont++;            
           if(cont === 3){
               this.destroy();
               return;
           }
           this.increaseShield();
        }, 1000, 1000);        
        
        return this;
    }
});

