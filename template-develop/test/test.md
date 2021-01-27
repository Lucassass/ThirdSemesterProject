# Mockup Environment

To be able to test the services, the team needs a test environment that runs independent from other teams. The Mail
service and Authentication service is heavily reliant on persistent data with user information. A frontend is needed to
make manual testing easier. The test environment can be seen in **figure x**. A User database is added that mocks the
Data security’s service and subscription service. [link to UserDatabase](https://gitlab.sdu.dk/semester-project-e2020/team-10-connection-security/template/-/blob/develop/userAPI/userAPI.js) The frontend service mocks the frontend html, js and routing with a
simple node express server. [Link to frontend](https://gitlab.sdu.dk/semester-project-e2020/team-10-connection-security/template/-/blob/develop/frontend/frontEndServer.js)

<img src="https://lh6.googleusercontent.com/MS_j03XW6aJoccSTUNkpaFbKlLcy3hX9al-R0FOaxD8zjAR5xo_rgxUz34G7reelDANC5IYgzIfeIvKs5tochCZ6xN_p9EfSf2SYcX5L2bhTu7jIwNSUgc_nJin90OUXl_jXsWDd" height="280">

_Figure x, Blockdiagram that represent the test environment_

# Testing

Automated testing was done using [Mocha](https://mochajs.org/) and [Chai](https://www.chaijs.com/).

Mocha is test framework, which runs on NodeJS and in the browser. Chai is an assertion libary.

[develop/test/test.ts](https://gitlab.sdu.dk/semester-project-e2020/team-10-connection-security/template/-/blob/develop/test/test.ts)

Mocha defines the test durations as the following (slow: default 75 ms)

![Test duration](https://media.discordapp.net/attachments/786183337228238878/789126546820038696/zivxUd6g1D1KCg6NENddQ3AACgNtenK37jXHOl6QJEkgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA.png)

This means a test must finish within 37.5 ms to be considered fast.

## Mail Service

It is difficult to make automated tests on a service that depends on encrypted information within an email. Some tests
are made to ensure that the service handles all kinds of requests without security breaches or crashes.

<table>
    <thead>
        <tr>
            <th>ID</th>
            <th>Preconditions</th>
            <th>Description</th>
            <th>Expected Result</th>
            <th>Result</th>
        </tr>
    </thead>
    <tbody>
<tr> 
<td rowspan="4">
AR1
</td>
<td>
<ol>
<p>- A user with known credentials is stored in the user database</p>
<p>- The email inbox of the user can be accessed.</p>
</ol>
</td>
<td>A user should be able to reset their password and insert a new one. We are going to test if a user is able to do this. </td>
<td>At the end an user-account has a new password that can access a login. 
</td> 
<td>:heavy_check_mark:</td> 
</tr>


<tr>
<td colspan=4 style="background-color: transparent; margin-bottom: 8px">
    <ol>
        <li>A post request is sent to the mailservice /forgotPass. with the email from an account.</li>
        <li>We check if the email-inbox has received an email from cstgruppe10@gmail.com. <a href="https://gitlab.sdu.dk/semester-project-e2020/team-10-connection-security/template/-/wikis/Connection-Security/Appendix#email-received">(Link to picture)</a></li>
        <li>The Reset Password button is clicked and resetPassword.html is reached. </li>
        <li>Developer tools are checked to verify that the browser received a cookie called mailtoken.
<a href="https://gitlab.sdu.dk/semester-project-e2020/team-10-connection-security/template/-/wikis/Connection-Security/Appendix#mailtoken-received" >(Link to picture) </a></li>
        <li>The desired new password is written</li>
        <li>The email-inbox has received a email to notify the user of the change of password.<a href="https://gitlab.sdu.dk/semester-project-e2020/team-10-connection-security/template/-/wikis/Connection-Security/Appendix#confirmation-email">(Link to picture) </a></li>
        <li>User can login with new password, verify by check access- and refresh token.<a href="https://gitlab.sdu.dk/semester-project-e2020/team-10-connection-security/template/-/wikis/Connection-Security/Appendix#confirmed-login">(Link to picture) </a></li>
    </ol>
</td>
</tr>
<tr>
</tr>
</tbody>
</table>
<br>


<table style="margin-bottom: 40px">
    <thead>
        <tr>
            <th>ID</th>
            <th>Description</th>
            <th>Expected Results</th>
            <th>Test result</th>
            <th>Duration</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td rowspan=5>
                AR1
            </td>
            <td>
            Reset password
            </td>
            <td>
            Correctly denies unauthorized attempts to reset password
            </td>
            <td>
               :heavy_check_mark:
            </td>
            <td colspan="">
            <span>< 37.5 ms <p class="alert-green" style="text-align: center">(Fast)</span>
            </td>
        </tr>
        <tr>
            <td colspan=4 style="background-color: transparent; margin-bottom: 8px">
            <p style="font-weight: bold; margin-bottom: 8px;"> <a href="https://gitlab.sdu.dk/semester-project-e2020/team-10-connection-security/template/-/blob/develop/test/test.ts#L115-135"> Mail service: POST /reset </a> </p>
                <span>:heavy_check_mark:</span> Denies access, when no URL params is set in body <br/>
                <span>:heavy_check_mark:</span> Denies access, when wrong URL params is set in body <br/>
            </td>
        <tr>
        <td colspan=4 style="background-color: transparent; margin-bottom: 8px">
            <p style="font-weight: bold; margin-bottom: 8px"> <a href="https://gitlab.sdu.dk/semester-project-e2020/team-10-connection-security/template/-/blob/develop/test/test.ts#L137-155">Mail service: POST /resetPassword_form with bad mailtoken </a> </p>
            <span>:heavy_check_mark:</span> Rejects an invalid mailtoken <br/>
            <span>:heavy_check_mark:</span> Rejects a POST without a mailtoken <br/>
        </td>
        </tr>
    </tbody>
</table>

## Authentication Service

<table>
    <thead>
        <tr>
            <th>ID</th>
            <th>Description</th>
            <th>Expected Results</th>
            <th>Test result</th>
            <th>Duration</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td rowspan=2>
                AS2
            </td>
            <td>
            Token Authentication
            </td>
            <td>
            Lets a user login, and returns cookies used for authentication
            </td>
            <td>
                <p style="color: green; text-align: center">:heavy_check_mark:</p>
            </td>
            <td>
            > 75 ms (Slow)
            </td>
        </tr>
        <tr>
            <td colspan=4 style="background-color: transparent; margin-bottom: 8px">
            <p style="font-weight: bold; margin-bottom: 8px;"> <a href="https://gitlab.sdu.dk/semester-project-e2020/team-10-connection-security/template/-/blob/develop/test/test.ts#L35-54"> Authentication Service: POST  /login </a> </p>
                <span>:heavy_check_mark:</span> Returns 200 if email and password exists in database <span>(80ms)</span><br/>
                <span>:heavy_check_mark:</span> Then sets cookies for authentication <span>(87ms)</span>
            </td>
        </tr>
<tr>
            <td rowspan=2>
                AS2.2
            </td>
            <td>
            Token Renewal
            </td>
            <td>
            Validates a refresh token and issues a new token pair
            </td>
            <td>
:heavy_check_mark:
            </td>
            <td>
            <span> > 75 ms <p style="color: red; text-align: center">(Slow)</span>
            </td>
        </tr>
        <tr>
            <td colspan=4 style="background-color: transparent; margin-bottom: 8px">
            <p style="font-weight: bold; margin-bottom: 8px"><a href="https://gitlab.sdu.dk/semester-project-e2020/team-10-connection-security/template/-/blob/develop/test/test.ts#L56-63"> Authentication Service: POST /refresh </a> </p>
                <span>:heavy_check_mark:</span> Authenticates refreshtoken, returns 200 and sets cookies <span style="color: red">(152ms)</span>
            </td>
        </tr>
                    <td rowspan=2>
                AS2.3
            </td>
            <td>
            Token Removal
            </td>
            <td>
            Invalidates a refresh token and removes cookies
            </td>
            <td>
            :exclamation:
            </td>
            <td>
            <span> > 75 ms <p style="color: red; text-align: center">(Slow)</span>
            </td>
        </tr>
        <tr>
            <td colspan=4 style="background-color: transparent; margin-bottom: 8px">
            <p style="font-weight: bold; margin-bottom: 8px"><a href=""> Authentication Service: POST /logout </a> </p>
                :heavy_check_mark: Blacklists refreshtoken in database (79ms)<br/>
                :heavy_check_mark: Subsequent /refresh calls return 403(42ms)<br/>
                :exclamation: Deletes old cookies by overwriting them with an expired date
            </td>
        </tr>
    </tbody>
</table>