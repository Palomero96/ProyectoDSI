import { ConversacionPage } from './../conversacion/conversacion';
import { ChatService } from './../../services/chat.service';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Chat } from '../../models/chat.model';
import { Observable } from 'rxjs/Observable';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, AngularFireObject } from 'angularfire2/database';
import { ContactService } from '../../services/contact.service';
import { AddContactoPage } from '../add-contacto/add-contacto';
import { Contact } from '../../models/contact.model';

/**
 * Generated class for the Tab2Page page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-tab2',
  templateUrl: 'tab2.html',
})
export class Tab2Page {
  userid:string;
  chat:Chat;
  chats:Observable<Chat[]>=null;
  chatid:string;
  datosPerfil: Observable<{}>;
  amigosPerfil: Observable<{}>;
  userorigen: string;
  userdest: string;
  contactoUno: Contact;
  contactoAuxiliar: AngularFireObject<Contact>;
  contactoDos: Contact;

  constructor(private afAuth: AngularFireAuth, private afDataBase: AngularFireDatabase,
    public navCtrl: NavController, public navParams: NavParams, private ChatService:ChatService, private ContactService:ContactService) {
  }
  

  /* Cuando hagamos la funcion del click para el boton habra que
  crear una variable en el servicio para el tener la informacion del chat
  y que la tenga la pagina de conversacion */
  ionViewDidLoad() {
    this.afAuth.authState.take(1).subscribe(data=>{
      this.amigosPerfil = this.ContactService.getAmigos(data.uid);
})
    console.log('ionViewDidLoad Tab2Page');
  }
  irConversacion(useridcontacto ){
    this.userid=useridcontacto;
    this.afAuth.authState.take(1).subscribe(async data=>{
      //De esta manera el id sera el mismo da igual quien cree la conversacion
      this.chatid = 'chat_'+(data.uid<this.userid ? data.uid+'_'+this.userid : this.userid+'_'+data.uid);
      this.contactoAuxiliar = this.afDataBase.object<Contact>(`perfil/${data.uid}`);
          this.contactoAuxiliar.snapshotChanges().subscribe(async action => {
          this.contactoUno = await action.payload.val();
          console.log("Nombre "+ this.contactoUno.nombre)
          this.userorigen=this.contactoUno.nombre+ "  " + this.contactoUno.apellidos;
          //Obtenemos el nombre del usuario al que queremos enviar mensajes
          this.contactoAuxiliar = this.afDataBase.object<Contact>(`perfil/${this.userid}`);
          this.contactoAuxiliar.snapshotChanges().subscribe(async action => {
          this.contactoDos = await action.payload.val();
          console.log("Nombre "+ this.contactoDos.nombre)
          this.userdest=this.contactoDos.nombre + "  " + this.contactoDos.apellidos;
          this.chat ={
            chatid: this.chatid,
            user1: data.uid,
            user2:this.userid,
            nombre1:this.userorigen,
            nombre2:this.userdest,
            }
            
            this.afDataBase.object(`chat/${this.chatid}`).set(this.chat).then(()=>
              this.navCtrl.setRoot(ConversacionPage,
                {chatid:this.chatid,
                userdest:this.userid,}));
        }); 
           
        });
       
        
      }
    )
  }
  nuevoAmigo()
  {
    this.navCtrl.push(AddContactoPage);
  }
  /*eliminarAmigo(id:string){
    this.afAuth.authState.take(1).subscribe(auth => {
      this.afDataBase.object(`perfil`, ref => ref.orderByChild(`amigos/id`).equalTo(value)
      this.afDataBase.object(`perfil/${auth.uid}/amigos/id`).remove({id:value});
      this.afDataBase.object(`perfil/${value}/amigos/`).set({id:auth.uid}).then(() => this.navCtrl.pop());
    })
    return this.db.list<Contact>(`perfil`, ref => ref.orderByChild(`amigos/id`).equalTo(value))
  }*/
}
