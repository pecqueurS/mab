<?php

namespace Mab\Controllers;

use Bundles\Formulaires\Forms;

use Bundles\Parametres\Conf;
use Mab\Models\UserModel;
use Bundles\Bdd\Db;
use Bundles\Bdd\Model;
use Services\Profil\Profil;

use Mab\Services\Profil\ProfilExtend;

/**
 *
 */
class Account {

    public function show($id) {
        //var_dump($id);
        $this->redirectUser('user', true);
        $response = array();

        return $response;
    }


    public function newTransaction() {
        //var_dump($id);
        $this->redirectUser('user', true);
        $response = array();

        return $response;
    }


    protected static function getErrorMessage($message) {
        if(isset($_SESSION['message'])) $_SESSION["message"] .= $message;
        else $_SESSION['message'] = $message;

    }

    protected function redirectUser($page, $isConnect = false) {
        if (ProfilExtend::isConnected() === $isConnect) {
            header('location:' . Conf::getLinks()->getConf()[$page]);
            die;
        }
    }




}



?>