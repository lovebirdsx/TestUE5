import os
import sys
import configparser

from typing import List

def get_root_dir():
    script_path = sys.argv[0]
    return script_path[0: script_path.find('/Content/')]

def get_saved_ini_filepath():
    return os.path.join(get_root_dir(), 'Saved/Editor.ini')

def read_ini():
    config = configparser.ConfigParser()
    saved_ini_filepath = get_saved_ini_filepath()
    if (os.path.exists(saved_ini_filepath)):
        config.read(saved_ini_filepath)

    return config

def parse_arg(config: configparser.ConfigParser, argv: List[str]):
    for arg in argv:
        op, value = arg.split('=')
        config.set('Watch', op, value)
        print('[Watch] %s=%s'%(op, value))

def write_ini(config: configparser.ConfigParser):
    with open(get_saved_ini_filepath(), 'w') as configfile:
        config.write(configfile)

def main():    
    ini = read_ini()
    parse_arg(ini, sys.argv[1:])
    write_ini(ini)

# 命令行格式类似于 CheckCircular=True RunLint=False
if __name__ == '__main__':
    main()
