# SIMRacingApps
## HTML5 Based Apps and Widgets, ReST Web Server, Java SDK.
=========================================================================================

## What is SIMRacingApps? 
  * It's a Web Server used to host Apps and Widgets, accessible using any device with a modern browser.
  * It comes with several Apps and Widgets free out of the box.
  * It's a ReST interface for developers to access the SIM Data via an HTTP call.
  * It's a HTML5 platform for other developers to write Apps and Widgets and share them with you.
  * It's a Java SDK for developing your own Java Based Apps that can work with any supported SIM.
  * And it is free, open source, released under the Apache 2.0 license.
  * Like us on facebook [SIMRacingApps](http://www.facebook.com/SIMRacingApps) to keep up with new releases and tips and tricks.

## Here is a partial list of the Apps and Widgets that are included.
  * CrewChief (Control your pit changes. Calculate fuel mileage, laps on tires, etc.)
  * TrackMap  (See where all the cars are overlaid on Satellite or Street Map images)
  * Dashes    (with fully working analog and bar gauges like Tach, Water Temp, Oil Temp, etc.)
  * Standings (see pit time for all cars, best and last laps times, etc.)
  * Relative  (see who is near you)
  * RaceAdministrator (Makes those pesky admin commands a touch or click of the mouse)
  * Spectator/Broadcaster (Puts lots of information at your finger tips on one page with selectable driver)
  * And there are more. Install the server and access them from the main page.

## Want to try it out? It's simple. 
### On the same computer where the simulator is running:
  * Download the latest version of SIMRacingAppsServer....exe from [here](http://www.github.com/SIMRacingApps/SIMRacingApps/releases/latest) and save it where you can find it later. It is not an installer.
  * Execute SIMRacingAppsServer....exe. 
  * If you don't have Java 1.8 or better installed, it will direct you to the download page so you can install Java.
  * Leave this window open while racing. You can minimize it, but note the HTTP://... address in the title of this window first. You will use the address to connect to the server from the client.
  
### Clients can be from any device connected to your home network (including the SIM computer):
  * Open the browser (Chrome, FireFox, IE10, EDGE, Safari) and enter the HTTP address of the server.
  * Click on an App or Widget and start racing. Clicking the icon will get help for that App or Widget.
  * In addition to using browsers, I have provided packages for using [Atom/Electron](https://github.com/atom/electron) and [Overwolf Apps](http://www.overwolf.com) platforms as clients for SIMRacingApps. Each platform has different features that might meet your specific needs. Refer to the readme files provided with each package to get a better idea on which one would be best for you.
  * More documentation is also available from the main menu.
    
## There is more...

If you are a developer, you can develop your own Apps and Widgets.
Detailed documentation is available from the main page.
Full source is available on GitHub at [SIMRacingApps](http://www.github.com/SIMRacingApps/SIMRacingApps).
By making the source available, I hope others will join in and help develop this farther. 
Just fork the source, make your changes and submit a pull request.

But, you do not have to be a Github expert to help out. 
You can simply develop your App or Widget in your personal folder and SIMRacingApps will scan for it and add it to the main page.
See below for details on creating your own App or Widget.
You can also share your App or Widget by creating a .SRA file that can be uploaded from the main page using the form at the bottom of the page. .SRA files are simply .ZIP files renamed. They are intended to be uploaded on the main menu. Each file in the archive will be extracted to the users personal folder located at Documents/SIMRacingApps.

The simulation data can be challenging to use.
Therefore, I have created an API layer above the SIM data to make using the SIM data simpler. 
This layer is available directly from the [SIMRacingApps Java SDK](../JavaDoc/index.html) as well as the ReST Web Server.
This layer is designed to be used with any simulator that we develop a plug-in for.
This layer does many of the calculations that the simulator doesn't provide directly for you.
But don't worry, if needed, the raw SIM data is available to you as well.
For full API documentation, install the server, connect to the main page and scroll down to the documentation section.

On the browser side, I have based this design on the [AngularJS](http://angularjs.org) framework. 
AngularJS framework supports the "Single Page Application" (SPA) design pattern.
This is where only one page is fetched from the server and AJAX calls are used to retrieve smaller amounts of data from the server as needed.
I provide an AngularJS service to call the SIMRacingApps server and get the data and feed it to Angular $scope.data variable so directives can bind or set watches on the data.
The way AngularJS binds the DOM elements to JavaScript objects, makes it a perfect match for this type of application.

In SIMRacingApps, I have provided several predefined Widgets for building Apps.
Widgets are Angular "directives", which allows them to be placed in the HTML file using a declarative syntax. 
Through a generic App called WidgetLoader, any widget can also be a stand alone App. 
Multiple widgets are designed to be used together to form an App. 

An App is simply an HTML page that declares what Widgets you want to use as an HTML tag.
Tags can have properties to control the Widget's behavior. 
These are fully styleable using CSS, you can size and position these as needed.
All widgets will resize themselves simply by providing "width" and "font-size" styles to the DOM element.
For a step by step guide to build an application, see the [SIMRacingApps - Overview for Creating an App](../documentation/SIMRacingApps%20-%20Overview%20for%20Creating%20an%20App/default.html) documentation.

Widgets define an AngularJS Directive and must confirm to that specification.
For a step by step guide to build a widget, see the [SIMRacingApps - Overview for Creating a Widget](../documentation/SIMRacingApps%20-%20Overview%20for%20Creating%20a%20Widget/default.html) documentation.

Below are the currently supported paths to the Generic SIM API. 
Using this API your application will possibly run across all supported SIMs if the SIM exports the data your are using.
Following the links will take you to the Java Documentation that this path is mapped to. 
Here you will find details on how the path works and what options you have.
For all the possible values supported for the CARIDENTIFIER, click [here](../JavaDoc/com/SIMRacingApps/Session.html#getCar-java.lang.String-).

## Generic API paths supported by the server

To access the data via the server, prefix these URLs with your server's IP address, optional port number and the data path.

Example(s): 

1. http://Your.Server.IP.Address:Port/SIMRacingApps/Data/...
2. http://192.168.1.61:80/SIMRacingApps/Data/Track/Description

Returns a JSON structure by default that looks like this:

<pre>
{
    "Type": "STRING",
    "UOM": "",
    "Format": "",
    "StatePercent": "0.0",
    "State": "NORMAL",
    "Value": "Charlotte Motor Speedway",
    "UOMAbbr": "",
    "UOMDesc": "",
    "Lang": "en",
    "ValueFormatted": "Charlotte Motor Speedway",
    "Name": "/Track/Description"
}
</pre>

You can also add the "output" parameter to the URL to just get the value you need. For example, this URL only returns the ValueFormatted. You can use "localhost" when your browser is running on the same computer as the server.

1. http://localhost/SIMRacingApps/Data/Track/Description?output=valueformatted


PUTPATHSHERE

[Copyright (C) 2015 - 2023 Jeffrey Gilliam](../COPYRIGHT.TXT)

[Apache License 2.0](../LICENSE.TXT)
