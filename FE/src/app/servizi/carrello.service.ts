import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

export interface CarrelloItem{
    id_viaggio: number;
    destinazione: string;
    PU:number;
    quantita: number;
    descrizione:string;
    immagine:string;
}

@Injectable({
    providedIn: 'root'
})
export class CarrelloService{
    private carrelloItem= new BehaviorSubject<CarrelloItem[]>([]); //per far aggiornare automaticamente i componenti
    /* Crea uno “stato reattivo”: un BehaviorSubject che contiene un array di CarrelloItem. Parte vuoto ([]). */
    public carrello$= this.carrelloItem.asObservable();

    constructor(){
        this.caricaCarrello();
    };

    //carica il carrello dal local storage
    private caricaCarrello() : void{
        const carrelloSalvato= localStorage.getItem('carrllo');
        if (carrelloSalvato){
            this.carrelloItem.next(JSON.parse(carrelloSalvato));
        }
    }

    //salva il carrello
    private salvaCarrello(items:CarrelloItem[]): void {
        localStorage.setItem('carrello',JSON.stringify(items));
        this.carrelloItem.next(items);
    }

    getItems(): CarrelloItem[]{
        return this.carrelloItem.value;
    }

    //ottiene tutti gli elemnti del carrello
    aggiungiViaggio(viaggio: CarrelloItem):void{
        const item = this.getItems();
        const itemEsiste = item.find(item => item.id_viaggio === viaggio.id_viaggio);

        if (itemEsiste){
            itemEsiste.quantita+=viaggio.quantita;
        }else item.push(viaggio);

        this.salvaCarrello;
    }

    //aggiorna qta viaggi disponibili
    aggiornaQuantita (id_viaggio: number, newQ: number):void{
        const items= this.getItems();
        const item = items.find(item=> item.id_viaggio === id_viaggio);
        if (item){
            if (newQ<=0){
                this.rimuoviViaggio(id_viaggio);
            }else{
                item.quantita= newQ;
                this.salvaCarrello(items);
            }
        }
    }

    rimuoviViaggio(id_viaggio : number):void{
        const items = this.getItems().filter(item=>item.id_viaggio !== id_viaggio);
        this.salvaCarrello;
    }

    svuotaCarrello(): void{
        this.salvaCarrello([]);
    }

    calcolaTot(): number {
        return this.getItems().reduce((totale,item)=> totale+(item.PU*item.quantita),0);
    }

    contaProdotti(): number {
        return this.getItems().reduce((totale, item)=> totale+item.quantita,0);
    }





}