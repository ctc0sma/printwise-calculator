# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# by Android build tools.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# If your project uses WebView with JS Interface enabled, specify this to preserve the names of your interface methods.
#-keepclassmembers class fqcn.of.javascript.interface.for.webview {
#   public *;
#}

# Capacitor
-keep public class * extends com.getcapacitor.BridgeActivity { *; }
-keep public class com.getcapacitor.community.admob.AdMob { *; }
-keep public class com.printwise.calculator.** { *; }