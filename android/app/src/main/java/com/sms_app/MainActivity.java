package com.sms_app;

import android.content.Intent; // Added for react-native-sms
import com.tkporter.sendsms.SendSMSPackage; // Added for react-native-sms
import com.facebook.react.ReactActivity;

import android.os.Bundle; // here 
import com.facebook.react.ReactActivity;
// react-native-splash-screen >= 0.3.1 
import org.devio.rn.splashscreen.SplashScreen; // here 

public class MainActivity extends ReactActivity {

  @Override
  public void onActivityResult(int requestCode, int resultCode, Intent data) {
      super.onActivityResult(requestCode, resultCode, data);
      //probably some other stuff here
      SendSMSPackage.getInstance().onActivityResult(requestCode, resultCode, data);
  }

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "sms_app";
  }

  @Override
  protected void onCreate(Bundle savedInstanceState) {
      SplashScreen.show(this);  // here
      super.onCreate(savedInstanceState);
  }
}
