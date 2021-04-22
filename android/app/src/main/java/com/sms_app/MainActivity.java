package com.sms_app;

import android.content.Intent; // Added for react-native-sms
import com.tkporter.sendsms.SendSMSPackage; // Added for react-native-sms
import com.facebook.react.ReactActivity;

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
}
