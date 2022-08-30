module com.example.blockchainsimulation {
    requires javafx.controls;
    requires javafx.fxml;


    opens com.example.blockchainsimulation to javafx.fxml;
    exports com.example.blockchainsimulation;
}
