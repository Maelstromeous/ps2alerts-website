# PS2Alerts
Planetside 2 Alert Statistics

## Installation

Rudimentary linux knowledge is required for this application. The tools supported by this application will most likely only run on Linux and I won't be supporting any other platform (as Linux is where you should be developing on yo!)

### Step 0: Install Ansible

You will need the [Ansible](https://docs.ansible.com/ansible/latest/installation_guide/intro_installation.html) platform in order to set up this app correctly. Ansible will orchastrate all the required installation and dependencies of the PS2Alerts stack, and handle deployments.

### Step 1: Get Ansible Dependencies

This project utilises [Ansible Galaxy](https://galaxy.ansible.com/docs/), which is a great network of Ansible Playbooks already done for you, saving tons of time and effort.

Install by running `ansible-galaxy install -r ansible-requirements.yml` within the `provisioning` directory.

### Step 2: Run initial setup for local environment

Install the local environment by simply running the ansible playbook from within the `provisioning` directory: `sudo ansible-playbook init-dev.yml -i inventories/hosts.yml`.