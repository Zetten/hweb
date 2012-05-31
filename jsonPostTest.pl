#!/usr/bin/perl
#
# POSTs simple JSON objects to the local Django Swift/Nest server for testing
#

use strict;
use warnings;
use Const::Fast;
use LWP::UserAgent;
use Term::ANSIColor;
use HTTP::Request::Common qw(POST GET);
use Log::Log4perl qw(get_logger :levels);
use Log::Log4perl::Appender::File;
use DateTime;
use DateTime::Format::Epoch;
use JSON;

# Initialise logger
const my $logLayout => Log::Log4perl::Layout::PatternLayout->new("%d %p> %M:%L --- %m%n");
const my $logAppender => Log::Log4perl::Appender->new("Log::Log4perl::Appender::ScreenColoredLevels");
$logAppender->layout($logLayout);
const my $log => get_logger();
$log->add_appender($logAppender);
$log->level($INFO);

# Initialise HTTP agent
const my $ua  => new LWP::UserAgent;
const my $url => "http://localhost:8000/nest/store";

# Format the time as milliseconds since the standard UNIX epoch
const my $dtFormatter => DateTime::Format::Epoch->new(
	epoch		=> DateTime->new( year => 1970, month => 1, day => 1 ),
	unit		=> 'milliseconds'
);

# Prepare dynamic variables for injection
my $time;
my $tm1234;
my $tm5678;

while (1) {
	# Sleep for 1-4 seconds
	sleep int(rand(3)) + 1;
	$time = $dtFormatter->format_datetime(DateTime->now());
	$tm1234 = rand();
	$tm5678 = int(rand(1000));

	my $tmData = {};
	$tmData->{'org.hbird.core.spacesystemmodel.tmtcgroups.HummingbirdParameterGroup'}->
		{'parameters'}->{'entry'}[0]->{'org.hbird.core.spacesystemmodel.parameters.HummingbirdParameter'}->
		{'name'} = "TM1234";
	$tmData->{'org.hbird.core.spacesystemmodel.tmtcgroups.HummingbirdParameterGroup'}->
		{'parameters'}->{'entry'}[0]->{'org.hbird.core.spacesystemmodel.parameters.HummingbirdParameter'}->
		{'receivedTime'} = $time;
	$tmData->{'org.hbird.core.spacesystemmodel.tmtcgroups.HummingbirdParameterGroup'}->
		{'parameters'}->{'entry'}[0]->{'org.hbird.core.spacesystemmodel.parameters.HummingbirdParameter'}->
		{'value'}->{'$'} = $tm1234;
		
	$tmData->{'org.hbird.core.spacesystemmodel.tmtcgroups.HummingbirdParameterGroup'}->
		{'parameters'}->{'entry'}[1]->{'org.hbird.core.spacesystemmodel.parameters.HummingbirdParameter'}->
		{'name'} = "TM5678";
	$tmData->{'org.hbird.core.spacesystemmodel.tmtcgroups.HummingbirdParameterGroup'}->
		{'parameters'}->{'entry'}[1]->{'org.hbird.core.spacesystemmodel.parameters.HummingbirdParameter'}->
		{'receivedTime'} = $time;
	$tmData->{'org.hbird.core.spacesystemmodel.tmtcgroups.HummingbirdParameterGroup'}->
		{'parameters'}->{'entry'}[1]->{'org.hbird.core.spacesystemmodel.parameters.HummingbirdParameter'}->
		{'value'}->{'$'} = $tm5678;

	my $jsonData = JSON->new->utf8->encode($tmData);

	my $req = POST $url;
	$req->header( 'Content-Type' => 'application/json' );
	$req->header( 'Content-Length' => length $jsonData );
	$req->content($jsonData);
	my $res = $ua->request($req);

	if ($res->is_success) {
		$log->info("Posted {$tm1234}/{$tm5678} at $time");
	} else {
		$log->warn("Request failed: " . $res->status_line);
		open ERRFILE, '>', 'error.html';
		print ERRFILE $res->content;
		close ERRFILE;
	}
}

