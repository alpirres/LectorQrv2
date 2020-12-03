import { Component } from "@angular/core";
import { BarcodeScannerOptions, BarcodeScanner} from "@ionic-native/barcode-scanner/ngx";
import { Comida } from '../Model/Comida';
import { ReservaService } from '../services/reserva.service';
import { UiService } from '../services/ui.service';

@Component({
  selector: "app-home",
  templateUrl: "home.page.html",
  styleUrls: ["home.page.scss"]
})
export class HomePage {
 
  private comidacart:Comida={
    fecha : "",
    hora : "",
    comida : [],
    userId : "",
    comentario :""
  };
  private email: string;
  ocultar:boolean=false;
  scannedData: string;
  barcodeScannerOptions: BarcodeScannerOptions;

  constructor(private barcodeScanner: BarcodeScanner,
    private reserva:ReservaService,
    private ui:UiService) {
    //Options
    this.barcodeScannerOptions = {
      showTorchButton: true,
      showFlipCameraButton: true
    };
  }

  async scanBar() {
    this.ocultar=false;
    await this.barcodeScanner.scan()
      .then( barcodeData => {
        this.scannedData = barcodeData.text;
        console.log(this.scannedData);
        try{
          this.reserva.readTodoById(this.scannedData).subscribe((salida) => {
            if (salida.data() && salida.data().fecha) {
              this.comidacart = {
                fecha: salida.data().fecha,
                hora: salida.data().hora,
                comida: salida.data().comida,
                userId: salida.data().userId,
                comentario: salida.data().comentario
              };
              this.ocultar = true;
              this.reserva.deleteTodo(this.scannedData).then((salida) => {
                console.log(salida);
                this.ui.presentToast('Reserva Eliminada de la base de datos', 2000, 'success');
              });
            } else {
              this.ui.presentToast('Esta Reserva ya estaba eliminada', 2000, 'primary');
            }
          });
        }catch{
          this.ui.presentToast('No se corresponde a una Reserva',2000,'danger');
        }
    });
  }

  
}